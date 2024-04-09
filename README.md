# Kaiware

A desktop application to manage your KaiOS phone. Not at all finished or bug free. Still just playing around.

### Demo

1. Launch Kaiware. It also starts a http server on port 3000 for your phone to connect to.
2. Ensure your computer and KaiOS phone are on the same network.
3. Find your computer's local IP address. It should be something like 192.168.x.x.
4. Clone [Kaiware Test Client](https://github.com/nothingspecialdev/kaiware-test-client) and update the `kaiwareAddressAndPort` variable in `script.js`.
5. Install Kaiware Test Client on your phone.
6. Click buttons to send data from your phone to Kaiware.

### Development

```bash
$ npm run dev
```

### Build

```bash
# For windows
$ npm run build:win

# For macOS
$ npm run build:mac

# For Linux
$ npm run build:linux
```
