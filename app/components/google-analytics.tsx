export function GoogleAnalytics() {
    return (
        <>
            {/* Google Analytics */}
            <script
                async
                src={`https://www.googletagmanager.com/gtag/js?id=G-C8XCRGVF02`}
            />
            <script
                dangerouslySetInnerHTML={{
                    __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());

              gtag('config', 'G-C8XCRGVF02', {
                page_path: window.location.pathname,
              });
            `,
                }}
            />
        </>
    );
}
