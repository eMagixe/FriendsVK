const easyvk = require('easyvk');
const path = require('path');
module.exports = class VK {
    constructor(username, password) {
        this.username = username;
        this.password = password;
    }
    addFriend = async (user_id, index) => {
        await easyvk({
            username: this.username,
            password: this.password,
            sessionFile: path.join(__dirname, '.my-session')
        }).then(async vk => {
            await vk.call('friends.add', {
                user_id: user_id,
                text: 'Привет мы кажется знакомы'
            }).then(() => {
                console.log(`Add #${index} id: ${user_id}.`);
                return true;
            }).catch(error => {
                return this.errors(error, index, user_id);
            });
        })
        .catch(error => {
            console.error(error);
        })
    }

    errors = (error, index, user_id) => {
        let { error_msg, error_code } = error || {};
        switch (error_code) {
            case undefined: console.error(error);
            break;
            case 15: console.error(`#${index} not add user: ${user_id} ${error_msg}.`);
            break;
            case 14: return new Error(error_msg);
        }
        return false;
    }

    getFriends = (user_id) => {
        return easyvk({
            username: this.username,
            password: this.password,
            sessionFile: path.join(__dirname, '.my-session')
        }).then(async vk => {
            let friend_ids = await vk.call('friends.get', {
                user_id: user_id,
            });
            return friend_ids.items;
        }).catch(error => {
            console.error(error);
            return [];
        })
    }
}