# Kaiware

A desktop application that lets you remotely debug apps on your KaiOS device. Still in the exploration and experimentation phase, so expect bugs and changes.

![Screenshot](/screenshots/screenshot-elements.png?raw=true)

### Features

The purpose of Kaiware is to provide remote debugging tools for platforms that may not have access to them.

- **HTML Element Inspector:** Inspect HTML elements and computed CSS styles within your application. Supports real-time editing of CSS styles, with immediate reflection on your running application.
- **Logging:** Display debug, info, warning, and error logs from your app. The Kaiware client shims the global `console` object to capture log events and sends them to the app on your desktop. This functionality can be disabled, and you can instead use the dedicated Kaiware logger.
- **Network Requests:** Monitor and analyze network requests made from your device, including all the information and stats you'd expect to see.
- **Storage:** View what's in your app's session and local storage. Future updates will include support for IndexedDB and other storage types.
- **Console:** Direct interaction with the global `window` object, enabling data manipulation, function execution, and other JavaScript operations directly from the console.

*Note: Some features are currently in basic form but are actively being improved.*

### Demo

1. Launch Kaiware. It also starts a http server on port 3000 for your phone to connect to.
2. Ensure your computer and KaiOS phone are on the same network.
3. Find your computer's local IP address. It should be something like 192.168.x.x.
4. Clone [Kaiware Test Client](https://github.com/nothingspecialdev/kaiware-test-client) and follow the instructions in the README.
5. Install Kaiware Test Client on your phone.
6. Click buttons to send data from your phone to Kaiware.

### Development

```bash
npm run dev
```