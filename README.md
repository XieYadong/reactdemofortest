## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

public/MP_verify_r4ywasgu7uZiE2IF 北京微信授权证书
public/MP_verify_YFOpLWZ0BL21KQyT 上海牛策略微信授权证书
public/MP_verify_l0WwO58Mhx90YDoA 中方财富管家（上海）

Open [http://localhost:3030](http://localhost:3030) with your browser to see the result.

You can start editing the page by modifying `pages/index.js`. The page auto-updates as you edit the file.

通用封装走 common

## VSCode 项目配置 `(.vscode/settings.json)`

```json
{
  // JavaScript
  "[javascript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[javascriptreact]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  // Typescript
  "[typescript]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  },
  "[typescriptreact]": {
    "editor.formatOnSave": true,
    "editor.defaultFormatter": "esbenp.prettier-vscode"
  }
}
```

## Docker Swarm 部署

```console
docker service create \
    --hostname="{{.Node.Hostname}}-{{.Node.ID}}-{{.Service.Name}}"\
    --name static-h5 \
    --network dc-primary \
    --with-registry-auth \
    -l traefik.enable=true \
    -l traefik.http.routers.static-h5.rule="Host(\`static.zfxfzb.com\`)" \
    -l traefik.http.routers.static-h5.tls.certresolver=default \
    -l traefik.http.services.static-h5.loadbalancer.server.port=8085 \
    registry-vpc.cn-shanghai.aliyuncs.com/zfxfsh/static-h5:0.1.1
```

## Docker Swarm 更新镜像版本

```console
docker service update --image registry-vpc.cn-shanghai.aliyuncs.com/zfxfsh/douniu-admin-frontend:0.1.2 douniu-admin-frontend
```

## Docker 构建环境环境

```console
测试环境  (名字+日期开头+xxx) 需要运维单独设置规则  docker文件使用Dockerfile.dev
git tag xydYYYYMMDDDD*   //可以根据自己习惯修改比如提前按顺序让设置好规则XXX1,XXX2等

git push --tags


正式环境
yarn release
```
