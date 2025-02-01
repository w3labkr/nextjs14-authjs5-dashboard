# GIT

Bump a package version

```shell
npm version [major | minor | patch]
```

Changing a remote repository's URL

```shell
$ git remote -v
> origin git@github.com:OWNER/REPOSITORY.git (fetch)
> origin git@github.com:OWNER/REPOSITORY.git (push)

$ git remote set-url origin https://github.com/OWNER/REPOSITORY.git

$ git remote -v
> origin https://github.com/OWNER/REPOSITORY.git (fetch)
> origin https://github.com/OWNER/REPOSITORY.git (push)
```
