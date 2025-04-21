import React from 'react'
import Script from 'next/script'

type AdSenseProps = {
    pId: string
}
const AdSense = ({pId}: AdSenseProps)  => {
  return (
    <div>
        <Script
        async 
        src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${pId}`}
        crossOrigin="anonymous"
        strategy="afterInteractive"
        />
    </div>
  )
}

export default AdSense