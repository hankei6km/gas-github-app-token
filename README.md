# gas-github-app-token

GitHub App の Access Token 取得をサポートする Google Apps Script のライブラリー。

## Setup

ライブラリーは App Script で利用できる状態になっています。
Apps Script のコードエディターで以下の手順を実行するとプロジェクトへ追加できます。

1. コードエディターのファイル名一覧が表示される部分の「ライブラリ +」をクリック
1. 「スクリプト ID」フィールドに `1S3DNbJEq91TAWt753wnEnDtUNcnWWBVSUl7_mNiyzi1rc9BwButo07xl` を入力し検索をクリック
1. バージョンを選択(通常は最新版)
1. 「ID」を `GitHubAppToken` へ変更
1. 「追加」をクリック

上記以外にも Release ページから `gas-github-app-token.zip` をダウンロードし、`/dist` ディレクトリーをプロジェクトへコピーできます。

## Usage

Google Apps Script のスクリプトから GitHub App のプライベートキーを利用して Access Token を取得する方法です。

### Convert private key

GitHub からダウンロードしたプライベートキーは Google Apps Script の `Utilities.computeRsaSha256Signature()` では扱えません。そのため、以下の方法で変換します(`xxxxx-private-key.pem` をダウンロードしたファイルに置き換えてください)。

```console
$ openssl pkcs8 -topk8 -inform pem -in xxxxx-private-key.pem -outform pem -nocrypt -out new-private.pem
```

### Properties

以下の項目をスクリプトから参照できる場所(スクリプトプロパティーなど)に保存します。

- App ID - GitHub App のアプリケーション ID
- Installation ID - インストールされた GitHub App へ付与されている ID
- Private Key - 上記で変換したプライベートキー

### Code

App Id などをスクリプトプロパティーへ保存している場合のサンプルです。

```js
function main() {
  const props = PropertiesService.getScriptProperties()
  const appId = props.getProperty('appId')
  const installationId = props.getProperty('installationId')
  const privateKey = props.getProperty('privateKey')

  // Generate URL and options to UrlFetchApp.fetch()
  const [url, opts] = GitHubAppToken.generate({
    appId,
    installationId,
    privateKey
  })

  // Fetch token
  const res = UrlFetchApp.fetch(url, opts)
  console.log(JSON.parse(res.getContentText())) // { token: 'xxxxxx', }
}
```

## TypeScript

TypeScript(clasp) でコードを記述している場合は、以下の方法で型定義を設定できます。

型定義パッケージをインストールします。

```console
$ npm install --save-dev  @hankei6km/gas-github-app-token
```

`tsconfig.json` に定義を追加します。

```json
{
  "compilerOptions": {
    "target": "ES2019",
    "module": "ES2020",
    "lib": ["ESNext"],
    "types": ["@types/google-apps-script", "@hankei6km/gas-github-app-token"]
  }
}
```

## License

MIT License

Copyright (c) 2022 hankei6km

```

```
