#!/usr/bin/env bash
# chmod +x *.sh

set -e

# change to the script's directory
pushd "$(dirname "${BASH_SOURCE[0]}")"

# method to recursively to popd on error
function popd_on_error {
  popd
  exit 1
}

# popd on error
trap popd_on_error ERR

sudo apt update -y && sudo apt install -y curl
sudo install -dm 755 /etc/apt/keyrings
curl -fSs https://mise.jdx.dev/gpg-key.pub | sudo tee /etc/apt/keyrings/mise-archive-keyring.asc 1> /dev/null
echo "deb [signed-by=/etc/apt/keyrings/mise-archive-keyring.asc] https://mise.jdx.dev/deb stable main" | sudo tee /etc/apt/sources.list.d/mise.list
sudo apt update -y
sudo apt install --yes --no-install-recommends mise

echo 'eval "$($(which mise) activate bash)"' >> ~/.bashrc
# bash: /root/.local/bin/mise: No such file or directory

mise use --global node

mise use --global python

mise settings experimental true

# cp ~/.config/mise/config.toml .devcontainer/home/.config/mise/config.toml
