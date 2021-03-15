### spfx install

Install SPFx solution. Installs the SPFx solution to the specified tenant.

Requires an old fashioned SharePoint app registration.

See: [How to register a legacy SharePoint application](./sp-app-registration.md)

```shell
did spfx install
```

or

```shell
did-cli spfx install
```

_You'll be prompted for all neccessary inputs._

#### With command line arguments

```shell
did spfx install --clientId {clientId} --clientSecret {clientSecret} --siteUrl {siteUrl} --githubToken {githubToken} --didApiKey {didApiKey}
```

![image-20210315153658957](assets/image-20210315153658957.png "Image can not be viewed from here.")

