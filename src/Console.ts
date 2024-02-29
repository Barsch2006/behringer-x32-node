import X32 from "./X32";

class Console {
    private _parent: X32;

    constructor(parent: X32) {
        this._parent = parent;
    }

    async load(type: "scene" | "snippet", index: number) {
        await this._parent.send("/load", type, index);
    }

    async save(type: "scene" | "snippet", index: number) {
        await this._parent.send("/save", type, index);
    }

    async delete(type: "scene" | "snippet", index: number) {
        await this._parent.send("/delete", type, index);
    }

    async copy(type: "scene" | "snippet", index: number, new_index: number) {
        await this._parent.send("/copy", type, index, new_index);
    }

    async rename(type: "scene" | "snippet", index: number, name: string) {
        await this._parent.send("/rename", type, index, name);
    }

    async loadScene(index: number) {
        await this._parent.send("/-action/goscene", index);
    }

    async lock() {
        await this._parent.send("/-stat/lock", 1);
    }

    async unlock() {
        await this._parent.send("/-stat/lock", 0);
    }

    async setLock(lock: boolean) {
        if (lock) await this.lock();
        else await this.unlock();
    }

    async setSendsOnFader(value: boolean) {
        await this._parent.send("/-stat/sendsonfader", value ? 1 : 0);
    }

    async setLeftFaderBank(value: "Ch1-16" | "Ch17-32" | "AuxIn-FXRtn" | "Bus") {
        switch (value) {
            case "Ch1-16":
                await this._parent.send("/-stat/chfaderbank", 0);
                break;
            case "Ch17-32":
                await this._parent.send("/-stat/chfaderbank", 1);
                break;
            case "AuxIn-FXRtn":
                await this._parent.send("/-stat/chfaderbank", 2);
                break;
            case "Bus":
                await this._parent.send("/-stat/chfaderbank", 3);
                break;
        }
    }

    async setRightFaderBank(value: "DCA" | "Bus1-8" | "Bus9-16" | "Matrix") {
        switch (value) {
            case "DCA":
                await this._parent.send("/-stat/grpfaderbank", 0);
                break;
            case "Bus1-8":
                await this._parent.send("/-stat/grpfaderbank", 1);
                break;
            case "Bus9-16":
                await this._parent.send("/-stat/grpfaderbank", 2);
                break;
            case "Matrix":
                await this._parent.send("/-stat/grpfaderbank", 3);
                break;
        }
    }

    async clearSolo() {
        await this._parent.send("/-stat/clearsolo", 1);
    }

    async setTalkback(value: {
        enabled?: boolean;
        A?: {
            level?: number;
            dim?: boolean;
            latch?: boolean;
        };
        B?: {
            level?: number;
            dim?: boolean;
            latch?: boolean;
        };
    }) {
        let promises = [];
        if (value.enabled) promises.push(this._parent.send("/config/talk/enable", 1));
        if (value.enabled === false) promises.push(this._parent.send("/config/talk/enable", 0));
        if (value.A?.dim) promises.push(this._parent.send("/config/talk/A/dim", 1));
        if (value.A?.dim === false) promises.push(this._parent.send("/config/talk/A/dim", 0));
        if (value.A?.latch) promises.push(this._parent.send("/config/talk/A/latch", 1));
        if (value.A?.latch === false) promises.push(this._parent.send("/config/talk/A/latch", 0));
        if (value.A?.level) promises.push(this._parent.send("/config/talk/A/level", value.A.level));
        if (value.B?.dim) promises.push(this._parent.send("/config/talk/B/dim", 1));
        if (value.B?.dim === false) promises.push(this._parent.send("/config/talk/B/dim", 0));
        if (value.B?.latch) promises.push(this._parent.send("/config/talk/B/latch", 1));
        if (value.B?.latch === false) promises.push(this._parent.send("/config/talk/B/latch", 0));
        if (value.B?.level) promises.push(this._parent.send("/config/talk/B/level", value.B.level));
        await Promise.all(promises);
    }
}

export default Console;
