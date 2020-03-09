/**
* By w3resource, 2020, https://www.w3resource.com/javascript-exercises/javascript-math-exercise-23.php
*/

export function generateUUID(){
    let dt = new Date().getTime();

    let uuid = "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
        const r = (dt + Math.random()*16)%16 | 0;
        dt = Math.floor(dt/16);
        return (c === "x" ? r :(r&0x3|0x8)).toString(16);
    });

    uuid = "t" + uuid.substring(1, uuid.length); // CSS does not work correctly with classes starting with a numeric character

    return uuid;
}
