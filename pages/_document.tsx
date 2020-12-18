import THEME from '~/build/theme.json'
import Document, { Head, Html, Main, NextScript } from 'next/document'

class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render () {
    return (
      <Html lang="en">
        <Head>
          <meta httpEquiv="Content-Type" content="text/html;charset=UTF-8" />
          <meta name="description" content={THEME.description} />

          <link
            rel="shortcut icon"
            href="/media/favicon.ico"
            type="image/x-icon"
          />
          <link
            rel="stylesheet"
            href={
              THEME.awsm
                ? `https://unpkg.com/awsm.css/dist/awsm_theme_${THEME.awsm}.min.css`
                : 'https://unpkg.com/awsm.css/dist/awsm.min.css'
            }
          />

          {THEME.analytics?.plausible ? (
            <script
              src="https://plausible.io/js/plausible.js"
              async
              defer
              data-domain={THEME.analytics.plausible}
            />
          ) : null}

          <script
            src="https://unpkg.com/@webcomponents/webcomponentsjs/webcomponents-loader.js"
            defer
          />
          <script type="module" src="/webcomponents.js"></script>
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
