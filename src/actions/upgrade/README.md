### Upgrade

Upgrade did-cli to the latest version from GitHub `main` branch.

```shell
did upgrade
```

or

```shell
did-cli upgrade
```

#### Upgrade from `dev` branch

```shell
did upgrade --branch dev
```

#### Reset environment
To reset environment when upgrading, use argument `---reset`. The default behavior is to keep the environment that was set running `did init`.

```shell
did upgrade --reset
```