import React from 'react'

interface AdSenseProps {
  pid: string;
}

const AdSense = ({ pid }: AdSenseProps) => {
  return (
    <div>
      <script
        async
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-${pid}`}
        crossOrigin="anonymous"
      >
     </script>
    </div>
  )
}

export default AdSense