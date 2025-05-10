"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

const MAX_UPLOADS_PER_CYCLE = 6;

// Helper function to add a year to a date
function addOneYear(date: Date): Date {
  const newDate = new Date(date);
  newDate.setFullYear(newDate.getFullYear() + 1);
  return newDate;
}

interface UploadStatus {
  count: number;
  cycleStartDate: Date | null;
  remaining: number;
  limitReached: boolean;
  error?: string;
}

export async function getUploadStatus(): Promise<UploadStatus> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { count: 0, cycleStartDate: null, remaining: MAX_UPLOADS_PER_CYCLE, limitReached: false, error: "User not authenticated" };
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("upload_count_current_cycle, cycle_start_date")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== 'PGRST116') { // PGRST116: row not found
    console.error("Error fetching profile for upload status:", profileError);
    return { count: 0, cycleStartDate: null, remaining: MAX_UPLOADS_PER_CYCLE, limitReached: false, error: "Could not fetch upload status." };
  }

  let count = profile?.upload_count_current_cycle || 0;
  let cycleStartDate = profile?.cycle_start_date ? new Date(profile.cycle_start_date) : null;
  const currentDate = new Date();

  if (cycleStartDate && currentDate >= addOneYear(cycleStartDate)) {
    // More than a year has passed since the cycle started, reset the cycle for the purpose of this status check
    // The actual reset will happen on the next upload record
    count = 0;
    cycleStartDate = null; // Indicate that a new cycle would start
  }
  
  const remaining = Math.max(0, MAX_UPLOADS_PER_CYCLE - count);
  const limitReached = count >= MAX_UPLOADS_PER_CYCLE;

  return { count, cycleStartDate, remaining, limitReached };
}

interface RecordUploadResult {
  success: boolean;
  newCount?: number;
  newRemaining?: number;
  newCycleStartDate?: Date;
  error?: string;
}

export async function recordUpload(): Promise<RecordUploadResult> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "User not authenticated" };
  }

  // First, get current status to decide on update logic
  const { data: currentProfileData, error: profileError } = await supabase
    .from("profiles")
    .select("upload_count_current_cycle, cycle_start_date")
    .eq("id", user.id)
    .single();

  if (profileError && profileError.code !== 'PGRST116') { 
    console.error("Error fetching profile for upload status:", profileError);
    return { success: false, error: "Could not fetch upload status." };
  }

  const currentCount = currentProfileData?.upload_count_current_cycle || 0;
  const currentCycleStartDate = currentProfileData?.cycle_start_date ? new Date(currentProfileData.cycle_start_date) : null;
  const currentDate = new Date();
  const newDbValues: { upload_count_current_cycle: number; cycle_start_date: string; id?: string } = {
      upload_count_current_cycle: 0,
      cycle_start_date: currentDate.toISOString().split('T')[0],
  };


  if (currentCycleStartDate && currentDate < addOneYear(currentCycleStartDate)) {
    // Still within the current cycle
    if (currentCount >= MAX_UPLOADS_PER_CYCLE) {
      return { success: false, error: "Upload limit reached for the current cycle." };
    }
    newDbValues.upload_count_current_cycle = currentCount + 1;
    newDbValues.cycle_start_date = currentCycleStartDate.toISOString().split('T')[0];
  } else {
    // New cycle starts or first ever upload for this tracking
    newDbValues.upload_count_current_cycle = 1;
    // cycle_start_date is already set to currentDate
  }
  
  // Ensure 'id' field is present for upsert if profile might not exist
  // However, a profile should exist if a user can reach this point
  // Assuming profile exists, so we use update. If not, an insert or upsert would be needed.
  // For simplicity, assuming profile row exists:
   newDbValues.id = user.id;


  const { error: updateError } = await supabase
    .from("profiles")
    .update({
        upload_count_current_cycle: newDbValues.upload_count_current_cycle,
        cycle_start_date: newDbValues.cycle_start_date,
    })
    .eq("id", user.id);
  
  // If the profile row might not exist, an upsert is safer:
  // const { error: upsertError } = await supabase
  //   .from("profiles")
  //   .upsert(newDbValues, { onConflict: 'id' });


  if (updateError) {
    console.error("Error updating profile after upload:", updateError);
    return { success: false, error: "Failed to record upload." };
  }

  revalidatePath("/"); // Or a more specific path if your FileDropZone is elsewhere

  return { 
    success: true, 
    newCount: newDbValues.upload_count_current_cycle,
    newRemaining: MAX_UPLOADS_PER_CYCLE - newDbValues.upload_count_current_cycle,
    newCycleStartDate: new Date(newDbValues.cycle_start_date)
  };
} 