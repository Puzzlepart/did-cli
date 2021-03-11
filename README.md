<!-- ⚠️ This README has been generated from the file(s) "readme.blueprint.md" ⚠️--><p align="center">
  <img src="assets/logo.png" alt="Logo" width="120" height="120" />
</p> <p align="center">
  <b>Add subscriptions, customers, projects and import data from different sources.... well, just CSV for now.</b></br>
  <sub>It's basically a CLI for did.<sub>
</p>

<br />


[![version](https://img.shields.io/badge/version-0.0.26-green.svg)](https://semver.org)


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#installation)

## ➤ Installation
The `cli` is not published to [npm](https://www.npmjs.com/) as it's a private repository.

You install the `cli` through github:

```shell
npm i -g "https://github.com/Puzzlepart/did-cli"
``` 


[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#initialize-the-cli)

## ➤ Initialize the cli
To start using the `cli`, you need to set it up.

Run

```shell
did init
```







[![-----------------------------------------------------](https://raw.githubusercontent.com/andreasbm/readme/master/assets/lines/rainbow.png)](#actions)

## ➤ Actions

#### subscription add

```shell
did subscription add
```

or

```shell
did-cli subscription add
```

![image-20210311092849679](assets/image-20210311092849679.png)


#### import csv

```shell
did import csv --path path_to_csv_file
```

or

```shell
did-cli import csv
```

![image-20210311092955701](assets/image-20210311092955701.png)


#### customer add

```shell
did customer add
```

or

```shell
did-cli customer add
```

![image-20210311093034792](assets/image-20210311093034792.png)
