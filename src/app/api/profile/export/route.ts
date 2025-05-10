import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';

export async function POST() {
  try {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch the user's profile row
    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single();

    if (error || !profile) {
      return NextResponse.json(
        { error: 'Profile not found' },
        { status: 404 }
      );
    }

    // Convert profile object to CSV
    const fields = Object.keys(profile);
    const values = fields.map(f => JSON.stringify(profile[f] ?? ''));
    const csv = `${fields.join(',')}
${values.join(',')}`;

    return new NextResponse(csv, {
      status: 200,
      headers: {
        'Content-Type': 'text/csv',
        'Content-Disposition': 'attachment; filename="profile_export.csv"',
      },
    });
  } catch (error) {
    console.error('Error exporting profile as CSV:', error);
    return NextResponse.json(
      { error: 'Failed to export profile data' },
      { status: 500 }
    );
  }
} 