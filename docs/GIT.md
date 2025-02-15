# GIT

Bump a package version

```shell
npm version [major | minor | patch]
```

View existing remotes

```shell
$ git remote -v
> origin git@github.com:OWNER/REPOSITORY.git (fetch)
> origin git@github.com:OWNER/REPOSITORY.git (push)
```

Changing a remote repository's URL

```shell
git remote set-url origin https://github.com/OWNER/REPOSITORY.git
```

Commit Template

```shell
git config commit.template .gitmessage.txt
```
