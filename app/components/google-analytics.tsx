export function GoogleAnalytics({ GoogleAnalyticsId }: { GoogleAnalyticsId: string | undefined }) {
   if (!GoogleAnalyticsId) {
    return null;
   }

   return (
      <>
      {/* Google Analytics */}
        <script
          async
          src={`https://www.googletagmanager.com/gtag/js?id=${GoogleAnalyticsId}`}
        />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', '${GoogleAnalyticsId}', {
                page_path: window.location.pathname,
              });
            `,
          }}
        />
      </>
   )
}