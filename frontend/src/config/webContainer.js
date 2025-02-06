import { WebContainer } from '@webcontainer/api';

let webcontainerInstance = null;

// create a small system where nodejs is already installed
export const getWebContainer = async () => {
    if (webcontainerInstance === null) {
        webcontainerInstance = await WebContainer.boot();
    }
    return webcontainerInstance;
}

// // Call only once
// const webcontainerInstance = await WebContainer.boot();