# mqtt2rf
Hooks up casual rf-controlled plugs to mqtt

## How to use
1. Be `root`
1. Install `nodejs` on jour raspberry pi
1. Build `send`-Executable from https://github.com/xkonni/raspberry-remote. Change directory into the repository and run `make send`.
3. Place `send` along the files from this reposiotires
4. Adjust [`config.json`](https://github.com/th-wilde/mqtt2rf/blob/2d76e1c133ae4deb3a6f08c11e9c7734004d91a3/config.json) to your needs
5. Change directory into the repository and run:
   1. `npm install`
   1. `npm start`
7. Check if it works. Stop execution witch `Ctrl+C`. Adjust whatever needed if an problem occur and try again with step 6. If everything is fine, continue with step 8.
8. Create systemd-service-unit-file at `/etc/systemd/system/mqtt2rf.service` with follwing content:
```ini
[Unit]
Description=MQTT2RF Bridge
After=network.target

[Service]
Type=simple
WorkingDirectory=/path/to/repository/mqtt2rf #<--- adjust to match your environment
ExecStart=npm start #<--- maybe use a absolute path to npm
User=root
SendSIGKILL=no
Restart=on-failure

[Install]
WantedBy=multi-user.target
```
7. Reload systemd serice deamon with `systemctl daemon-reload`
8. Enable the mqtt2rf service with `systemctl enable mqtt2rf`
9. Start the mqtt2rf service with `systemctl start mqtt2rf`
