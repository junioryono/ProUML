import Document, { DocumentContext, DocumentInitialProps, Html, Head, Main, NextScript } from "next/document";

// <title>ProUML</title>
// <meta charSet="utf-8" />
// <meta name="viewport" content="width=device-width" />
// <meta name="description" content="TODO" />
// <meta property="og:title" content="ProUML" />
// <meta property="og:type" content="website" />
// <meta property="og:url" content="https://prouml.com.com" />
// <meta property="og:image" content="https://prouml.com.com/og.jpg" />
// <meta name="twitter:title" content="ProUML" />
// <meta name="twitter:card" content="summary_large_image" />
// <meta property="twitter:url" content="https://prouml.com.com" />
// <meta name="twitter:image" content="https://prouml.com.com/og.jpg" />

export default class CustomDocument extends Document {
   static async getInitialProps(ctx: DocumentContext): Promise<DocumentInitialProps> {
      const initialProps = await Document.getInitialProps(ctx);

      return initialProps;
   }

   render() {
      return (
         <Html lang="en" className="bg-white font-sans text-slate-900 antialiased">
            <Head title="ProUML">
               <link
                  href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap"
                  rel="stylesheet"
               />
            </Head>
            <body className="min-h-screen">
               <Main />
               <NextScript />
            </body>
         </Html>
      );
   }
}
