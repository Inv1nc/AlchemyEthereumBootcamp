function deepRetrieval(obj) {
    if (typeof(obj.prop) == "object") {
        return deepRetrieval(obj.prop)
    } else {
        return obj.prop;
    }
}