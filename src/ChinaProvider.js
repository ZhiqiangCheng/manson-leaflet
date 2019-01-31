L.TileLayer.ChinaProvider = L.TileLayer.extend({
  initialize: function(type, options) {
    // (type, Object)
    var providers = L.TileLayer.ChinaProvider.providers;
    var parts = type.split(".");
    var providerName = parts[0];
    var mapName = parts[1];
    var mapType = parts[2];
    var url = providers[providerName][mapName][mapType];
    options.subdomains = providers[providerName].Subdomains;
    L.TileLayer.prototype.initialize.call(this, url, options);
  }
});
L.TileLayer.ChinaProvider.providers = {
  TianDiTu: {
    Normal: {
      Map:
        "https://t{s}.tianditu.gov.cn/DataServer?T=vec_w&X={x}&Y={y}&L={z}&tk=7d58a095ebf2b9488895e64e97632047",
      Annotion:
        "https://t{s}.tianditu.gov.cn/DataServer?T=cva_w&X={x}&Y={y}&L={z}&tk=7d58a095ebf2b9488895e64e97632047"
    },
    Satellite: {
      Map:
        "https://t{s}.tianditu.gov.cn/DataServer?T=img_w&X={x}&Y={y}&L={z}&tk=7d58a095ebf2b9488895e64e97632047",
      Annotion:
        "https://t{s}.tianditu.gov.cn/DataServer?T=cia_w&X={x}&Y={y}&L={z}&tk=7d58a095ebf2b9488895e64e97632047"
    },
    Terrain: {
      Map:
        "https://t{s}.tianditu.gov.cn/DataServer?T=ter_w&X={x}&Y={y}&L={z}&tk=7d58a095ebf2b9488895e64e97632047",
      Annotion:
        "https://t{s}.tianditu.gov.cn/DataServer?T=cta_w&X={x}&Y={y}&L={z}&tk=7d58a095ebf2b9488895e64e97632047"
    },
    Subdomains: ["0", "1", "2", "3", "4", "5", "6", "7"]
  },

  GaoDe: {
    Normal: {
      Map:
        "http://webrd0{s}.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}"
    },
    Satellite: {
      Map:
        "http://webst0{s}.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}",
      Annotion:
        "http://webst0{s}.is.autonavi.com/appmaptile?style=8&x={x}&y={y}&z={z}"
    },
    Subdomains: ["1", "2", "3", "4"]
  },

  Google: {
    Normal: {
      Map: "http://www.google.cn/maps/vt?lyrs=m@189&gl=cn&x={x}&y={y}&z={z}"
    },
    Satellite: {
      Map: "http://www.google.cn/maps/vt?lyrs=s@189&gl=cn&x={x}&y={y}&z={z}"
    },
    Subdomains: []
  },

  Geoq: {
    Normal: {
      Map:
        "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineCommunity/MapServer/tile/{z}/{y}/{x}",
      Color:
        "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetColor/MapServer/tile/{z}/{y}/{x}",
      PurplishBlue:
        "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetPurplishBlue/MapServer/tile/{z}/{y}/{x}",
      Gray:
        "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetGray/MapServer/tile/{z}/{y}/{x}",
      Warm:
        "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetWarm/MapServer/tile/{z}/{y}/{x}",
      Cold:
        "http://map.geoq.cn/ArcGIS/rest/services/ChinaOnlineStreetCold/MapServer/tile/{z}/{y}/{x}"
    },
    Subdomains: []
  }
};

L.tileLayer.chinaProvider = function(
  type,
  options = { maxZoom: 18, minZoom: 2 }
) {
  return new L.TileLayer.ChinaProvider(type, options);
};
L.tileLayer.chinaProviderGroup = () => {
  const names = {
    TianDiTu: {
      Normal: ["TianDiTu.Normal.Map", "TianDiTu.Normal.Annotion"],
      Satellite: ["TianDiTu.Satellite.Map", "TianDiTu.Satellite.Annotion"],
      Terrain: ["TianDiTu.Terrain.Map", "TianDiTu.Terrain.Annotion"]
    },
    GaoDe: {
      Normal: "GaoDe.Normal.Map",
      Satellite: ["GaoDe.Satellite.Map", "GaoDe.Satellite.Annotion"]
    },
    Google: {
      Normal: "Google.Normal.Map",
      Satellite: "Google.Satellite.Map"
    },
    Geoq: {
      Normal: {
        Map: "Geoq.Normal.Map", // 地图
        Color: "Geoq.Normal.Color", // 多彩
        PurplishBlue: "Geoq.Normal.PurplishBlue", // 午夜蓝
        Gray: "Geoq.Normal.Gray", // 灰色
        Warm: "Geoq.Normal.Warm", // 暖色
        Cold: "Geoq.Normal.Cold" // 冷色
      }
    }
  };

  /**
   * get default layers
   *
   * @param {*} types
   * @param {*} option
   * @returns
   */
  function getDefaultLay(types, option) {
    return L.layerGroup(
      types.map(function(item) {
        return L.tileLayer.chinaProvider(item, option);
      })
    );
  }
  return {
    TianDiTu(option) {
      return {
        Normal: getDefaultLay(names.TianDiTu.Normal, option),
        Satellite: getDefaultLay(names.TianDiTu.Satellite, option),
        Terrain: getDefaultLay(names.TianDiTu.Terrain, option)
      };
    },
    GaoDe(option) {
      return {
        Normal: L.tileLayer.chinaProvider(names.GaoDe.Normal, option),
        Satellite: getDefaultLay(names.GaoDe.Satellite, option)
      };
    },
    Google(option) {
      return {
        Normal: L.tileLayer.chinaProvider(names.Google.Normal, option),
        Satellite: L.tileLayer.chinaProvider(names.Google.Satellite, option)
      };
    },
    Geoq(option) {
      return {
        Normal: {
          Map: L.tileLayer.chinaProvider(names.Geoq.Normal.Map, option), // 地图
          Color: L.tileLayer.chinaProvider(names.Geoq.Normal.Color, option), // 多彩
          PurplishBlue: L.tileLayer.chinaProvider(
            names.Geoq.Normal.PurplishBlue,
            option
          ), // 午夜蓝
          Gray: L.tileLayer.chinaProvider(names.Geoq.Normal.Gray, option), // 灰色
          Warm: L.tileLayer.chinaProvider(names.Geoq.Normal.Warm, option), // 暖色
          Cold: L.tileLayer.chinaProvider(names.Geoq.Normal.Cold, option) // 冷色
        }
      };
    }
  };
};
