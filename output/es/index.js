class MB {
    constructor() {
        this.__isMaybe = true;
    }
    chain(fn) {
        return this.something ? fn(this.value) : Nothing();
    }
    flatten() {
        if (this.something) {
            const val = this.value;
            if (typeof val === 'object' && '__isMaybe' in val) {
                return val;
            }
        }
        // Rewrap the value in a maybe so there is a new object
        return Maybe(this.value);
    }
    then(fn) {
        return this.chain((v) => Maybe(fn(v))).flatten();
    }
    orElse(mElse) {
        return this.something ? this.value : mElse;
    }
}
const makeMaybe = () => {
    return new MB();
};
// Need to use assign so that the object remains correctly bound to the methods.
const Nothing = () => {
    return Object.assign(makeMaybe(), {
        something: false,
    });
};
const Something = (value) => {
    if (value === undefined || value === null) {
        throw new Error('Maybe.Just cannot be undefined or null');
    }
    return Object.assign(makeMaybe(), {
        something: true,
        value: value,
    });
};
const MaybeDictionary = (dictionary) => {
    return new Proxy(dictionary, {
        get: (target, name) => {
            const value = target[name];
            if (!value || !('__isMaybe' in value)) {
                const mb = Maybe(value);
                target[name] = mb;
                return mb;
            }
            return value;
        },
    });
};
const isSomething = (val) => {
    return val.something;
};
const isNothing = (val) => {
    return !val.something;
};
const Maybe = (value) => {
    return value !== undefined && value !== null ? Something(value) : Nothing();
};

class ResultInternal {
    constructor(options) {
        this.ok = options.ok;
        this.value = options.value;
    }
    chain(fn) {
        if (this.ok) {
            return fn(this.value);
        }
        return Err(this.value);
    }
    bothChain(fnOk, fnErr) {
        if (this.ok) {
            return fnOk(this.value);
        }
        return fnErr(this.value);
    }
    /**
     * Works just like chain, but is only called if this Result is an error.
     * This returns a new Result with type Result<R, NewType>
     */
    errChain(fn) {
        if (!this.ok) {
            return fn(this.value);
        }
        return Ok(this.value);
    }
    flatten() {
        if (this.value && this.value instanceof ResultInternal) {
            return this.value;
        }
        return this;
    }
    /**
     * This allows users to opperate on a presumed result without needing to know whether or not
     * the result was successful or not.
     * At each call if it is a result type of ok, it will call the supplied function, otherwise it
     * will return the current value with a new Err.
     *
     * @param fnOk Function that takes in an ok value of type R and returns either F or Result<F,E>
     */
    then(fnOk) {
        if (this.ok) {
            return Ok(fnOk(this.value)).flatten();
        }
        return Err(this.value);
    }
    /**
     * Works just like then, but is only called if this Result is an error.
     * This returns a new Result with type Result<R, NewType>
     */
    errThen(fnErr) {
        if (!this.ok) {
            return Err(fnErr(this.value)).flatten();
        }
        return Ok(this.value);
    }
    okOrElse(okElse) {
        if (this.ok) {
            return this.value;
        }
        return okElse;
    }
    errOrElse(errElse) {
        if (!this.ok) {
            return this.value;
        }
        return errElse;
    }
    /**
     * Takes in two functions, one which takes type R and the other which takes type E and both return
     * type T. This lets you handle either case and potentially return a unifying type. You might use this
     * to create a message for users.
     *
     * @param fnOk Function that maps from Ok value(R) to new type T
     * @param fnErr Function that maps from Err value(E) to new type T
     */
    resolve(fnOk, fnErr) {
        if (this.ok) {
            return fnOk(this.value);
        }
        return fnErr(this.value);
    }
    /**
     * This function will either return the current Ok value or use
     * the function provided to generate that from the Err value that it contains
     * @param fnErr Function that maps from Err value(E) to current type R
     */
    resolveOk(fnErr) {
        if (this.ok) {
            return this.value;
        }
        return fnErr(this.value);
    }
    /**
     * This function will either return the current Err value or use
     * the function provided to generate that from the Ok value that it contains
     *
     * @param fnOk Function that maps from Ok value(R) to current type E
     */
    resolveErr(fnOk) {
        if (this.ok) {
            return fnOk(this.value);
        }
        return this.value;
    }
}
const Ok = (value) => {
    return new ResultInternal({ value: value, ok: true });
};
const Err = (value) => {
    return new ResultInternal({ value: value, ok: false });
};
const isOk = (r) => {
    return r.ok;
};
const isErr = (r) => {
    return !r.ok;
};
const partitionResults = (results) => {
    return results.reduce((acc, value) => {
        if (value.ok) {
            acc[0].push(value.value);
        }
        else {
            acc[1].push(value.value);
        }
        return acc;
    }, [[], []]);
};

export { Err, Maybe, MaybeDictionary, Nothing, Ok, Something, isErr, isNothing, isOk, isSomething, partitionResults };
//# sourceMappingURL=index.js.map
