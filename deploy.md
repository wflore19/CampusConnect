# Updating Your DigitalOcean Droplet

This guide outlines the steps to update your DigitalOcean droplet with the latest changes from your GitHub repository.

## Steps

1. **Pull the latest changes from GitHub**

```bash
git pull origin main
```

2. **Install any new dependencies**

```bash
npm install
```
3. **Rebuild the project**

```bash
npm run build
```
4. **Restart your application server**

```bash
pm2 restart CampusConnect
```
