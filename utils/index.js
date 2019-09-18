// ----DATA MANIPULATION-----

exports.createRef = (arr, key, value) => {
  return arr.reduce((acc, obj) => {
    acc[obj[value]] = obj[key];
    return acc;
  }, {});
};

exports.renameKey = (arr, originalKey, newKey) => {
  return arr.map(element => {
    const newElement = { ...element, [newKey]: element[originalKey] };
    delete newElement[originalKey];
    return newElement;
  });
};
//-----LECTURE----
exports.formatShopData = (shopData, ownerRef) => {
  return shopData.map(({ owner, ...shopDatum }) => {
    return { ...shopDatum, owner_id: ownerRef[owner] };
  });
};

exports.formatTreasureData = (treasureData, shopRef) => {
  return treasureData.map(({ shop, ...rest }) => {
    return { ...rest, shop_id: shopRef[shop] };
  });
};
