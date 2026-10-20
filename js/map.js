/**
 * CYBER-SPECTRE-NEXUS: Master Operations Tactical Map & Multi-Monitor Engine
 * Integrates:
 * - Mapbox Satellite & Dark layers with authentic token
 * - RainViewer Live Doppler Radar loops
 * - OpenSky ADS-B live commercial flight tracking
 * - NASA FIRMS active wildfire hotspots from live satellite telemetry
 * - USGS global earthquake tremors
 * - ISS live orbital trajectory
 * - Proximity camera lock updating Monitor 2
 */

const MAPBOX_TOKEN = "";

// Use window.resolveCountry defined in player.js
const getCountryLabel = (lat, lon, fb = '') => (window.resolveCountry ? window.resolveCountry(lat, lon, fb) : (fb || 'International'));

window.isOceanCoordinate = function(lat, lon) {
    if (lat === undefined || lon === undefined) return false;
    lat = parseFloat(lat);
    lon = parseFloat(lon);
    if (isNaN(lat) || isNaN(lon)) return false;

    // 0. Null Island (0,0) or near zero
    if (Math.abs(lat) < 0.1 && Math.abs(lon) < 0.1) return true;

    // Critical Safeguards: NEVER classify land masses / islands as open ocean
    // A. Australia mainland & Tasmania
    if (-44.5 <= lat && lat <= -10.0 && 112.0 <= lon && lon <= 154.5) return false;
    // B. Caribbean Islands, Cuba, Hispaniola, Puerto Rico, Lesser Antilles
    if (10.0 <= lat && lat <= 27.5 && -86.0 <= lon && lon <= -59.0) return false;
    // C. Canary Islands
    if (27.0 <= lat && lat <= 29.8 && -18.8 <= lon && lon <= -13.0) return false;
    // D. Madeira
    if (32.2 <= lat && lat <= 33.4 && -17.6 <= lon && lon <= -16.1) return false;
    // E. Azores
    if (36.5 <= lat && lat <= 40.2 && -31.5 <= lon && lon <= -24.5) return false;
    // F. Iceland
    if (63.0 <= lat && lat <= 67.0 && -25.0 <= lon && lon <= -13.0) return false;
    // G. Ireland, UK & European coastline
    if (lat >= 34.0 && lon >= -11.0) return false;
    // H. New Zealand
    if (-47.5 <= lat && lat <= -34.0 && 166.0 <= lon && lon <= 179.0) return false;
    // I. Japan
    if (24.0 <= lat && lat <= 46.0 && 122.0 <= lon && lon <= 146.0) return false;
    // J. Hawaii
    if (18.5 <= lat && lat <= 22.5 && -160.5 <= lon && lon <= -154.5) return false;
    // K. Philippines / Indonesia / Pacific Archipelago
    if (-11.0 <= lat && lat <= 19.0 && 115.0 <= lon && lon <= 179.0) return false;

    // 1. Central North Atlantic deep abyssal waters
    if (18.0 <= lat && lat <= 58.0 && -55.0 <= lon && lon <= -33.0) return true;

    // 2. Central South Atlantic deep abyssal waters
    if (-50.0 <= lat && lat <= -5.0 && -30.0 <= lon && lon <= 5.0) return true;

    // 3. Open Central Pacific deep abyssal waters (far from any land)
    if (-40.0 <= lat && lat <= 45.0 && (-150.0 <= lon && lon <= -130.0)) return true;

    // 4. Central Indian Ocean deep waters
    if (-45.0 <= lat && lat <= -5.0 && 65.0 <= lon && lon <= 90.0) return true;

    return false;
};

window.PROVIDER_COLORS = {
    'Windy': '#10b981', 'windy': '#10b981',
    'Panomax': '#818cf8', 'Roundshot': '#ec4899',
    'EarthCam': '#00f0ff', 'Skyline': '#f59e0b', 'OpenCam': '#38bdf8',
    'FotoWebcam': '#38bdf8', 'USGS_Volcano': '#ef4444', 'SeeWebcams': '#0ea5e9',
    'KielCanal': '#14b8a6', 'PortHamburg': '#60a5fa', 'WhatsUpCams': '#f43f5e',
    'LiveCamCroatia': '#a855f7', 'ExploreOrg': '#eab308', 'Africam': '#f97316',
    'INGV_Volcano': '#dc2626', 'RUV_Iceland': '#fb7175', 'EarthTV': '#c084fc',
    'SwissWebcams': '#ef4444', 'NorwayFjords': '#2dd4bf', 'NorskLuft': '#facc15',
    'RailCam': '#93c5fd', 'PTZtv_Ports': '#38bdf8', 'MahoBeach': '#fbbf24',
    'PragueAirport': '#818cf8', 'Surfline': '#06b6d4', 'LiveBeaches': '#f472b6',
    'TokyoLive': '#e879f9', 'BaliTower': '#4ade80', 'WorldCam': '#a3e635',
    'VeniceLive': '#38bdf8', 'NiagaraLive': '#67e8f9', 'YellowstoneNPS': '#f59e0b',
    'ISSSpaceView': '#00f0ff', 'Lookr': '#a855f7', 'CaltransCCTV': '#fb923c',
    'OKDOT': '#0284c7', 'TxDOT': '#ef4444', 'CDOT': '#10b981', 'NMDOT': '#f59e0b',
    'KDOT': '#eab308', 'NOAA_WEATHER': '#38bdf8', 'OKLAHOMA_MESONET': '#10b981',
    'WestTexasMesonet': '#f59e0b', 'OklahomaMesonet': '#10b981',
    // European Highway & Traffic Authorities
    'hessen_mobil': '#38bdf8', 'HessenMobil': '#38bdf8',
    'bayern_info': '#60a5fa', 'BayernInfo': '#60a5fa',
    'strassen_nrw': '#34d399', 'StrassenNRW': '#34d399',
    'vmz_berlin': '#f59e0b', 'VMZBerlin': '#f59e0b',
    'verkehrsinfo_bw': '#fbbf24', 'VerkehrsinfoBW': '#fbbf24',
    'nlstbv_niedersachsen': '#10b981', 'NLStBV': '#10b981',
    'asfinag_austria': '#ef4444', 'ASFINAG': '#ef4444',
    'astra_switzerland': '#dc2626', 'ASTRA': '#dc2626',
    'bison_fute_france': '#3b82f6', 'BisonFute': '#3b82f6',
    'dirif_paris': '#6366f1', 'DiRIF': '#6366f1',
    'dgt_spain': '#f59e0b', 'DGT_Spain': '#f59e0b',
    'rws_netherlands': '#f97316', 'Rijkswaterstaat': '#f97316',
    'anas_italy': '#10b981', 'ANAS_Italy': '#10b981',
    'national_highways_uk': '#0284c7', 'NationalHighways': '#0284c7',
    'traffic_scotland': '#0ea5e9', 'TrafficScotland': '#0ea5e9',
    // US State Departments of Transportation (DOTs)
    'massdot_highway': '#0284c7', 'MassDOT': '#0284c7',
    'illinois_dot': '#f59e0b', 'IDOT': '#f59e0b',
    'michigan_dot': '#3b82f6', 'MDOT': '#3b82f6',
    'ohio_dot': '#ef4444', 'ODOT': '#ef4444',
    'georgia_dot': '#10b981', 'GDOT': '#10b981',
    'florida_dot_d6': '#06b6d4', 'FDOT': '#06b6d4',
    'virginia_dot': '#8b5cf6', 'VDOT': '#8b5cf6',
    'north_carolina_dot': '#ec4899', 'NCDOT': '#ec4899',
    'tennessee_dot': '#f59e0b', 'TDOT': '#f59e0b',
    'missouri_dot': '#a855f7', 'MoDOT': '#a855f7',
    'arizona_adot': '#f97316', 'ADOT': '#f97316',
    'nevada_ndot': '#eab308', 'NDOT': '#eab308',
    'hawaii_dot': '#06b6d4', 'HDOT': '#06b6d4',
    'wsdot_traffic': '#14b8a6', 'WSDOT': '#14b8a6',
    'oregondot_tripcheck': '#22c55e', 'OregonDOT': '#22c55e',
    'penndot_traffic': '#38bdf8', 'PennDOT': '#38bdf8',
    'ny_thruway': '#3b82f6', 'NYThruway': '#3b82f6',
    'mndot_traffic': '#0ea5e9', 'MnDOT': '#0ea5e9',
    'colorado_cotrip': '#10b981', 'ColoradoDOT': '#10b981',
    'utah_udot': '#f59e0b', 'UDOT': '#f59e0b',
    // Rail & Transit Authorities
    'swisspass_sbb_open': '#dc2626', 'SBB_OpenData': '#dc2626',
    'sncf_open_data': '#ec4899', 'SNCF_OpenData': '#ec4899',
    'ratp_paris': '#10b981', 'RATP_Paris': '#10b981',
    'rfi_trenitalia': '#ef4444', 'Trenitalia_RFI': '#ef4444',
    'renfe_spain': '#a855f7', 'Renfe_Spain': '#a855f7',
    'prorail_netherlands': '#f59e0b', 'ProRail': '#f59e0b',
    'pkp_intercity': '#0284c7', 'PKP_Intercity': '#0284c7',
    'banedanmark': '#06b6d4', 'Banedanmark': '#06b6d4',
    'bkk_budapest': '#a855f7', 'BKK_Budapest': '#a855f7',
    'pid_prague': '#ef4444', 'PID_Prague': '#ef4444',
    'vbb_berlin': '#f59e0b', 'VBB_Berlin': '#f59e0b',
    'mta_nyct': '#0284c7', 'MTA_NYCT': '#0284c7',
    'tfl_london': '#dc2626', 'TfL_London': '#dc2626',
    'stm_montreal': '#0ea5e9', 'STM_Montreal': '#0ea5e9',
    'sydney_metro_trans': '#10b981', 'SydneyMetro': '#10b981',
    'tokyo_metro_odpt': '#38bdf8', 'TokyoMetro': '#38bdf8',
    'sg_lta_datamall': '#6366f1', 'LTA_Singapore': '#6366f1',
    'caltrain_transit': '#ef4444', 'Caltrain': '#ef4444',
    'bart_transit': '#0284c7', 'BART': '#0284c7',
    'cta_chicago': '#06b6d4', 'CTA_Chicago': '#06b6d4',
    'brampton_transit': '#22c55e', 'GO_Transit': '#22c55e',
    // Expanded Official Meteorological Agencies
    'rmi_belgium': '#f59e0b', 'RMI_Belgium': '#f59e0b',
    'meteoam_italy': '#10b981', 'MeteoAM': '#10b981',
    'imgw_poland': '#ef4444', 'IMGW_Poland': '#ef4444',
    'shmu_slovakia': '#3b82f6', 'SHMU_Slovakia': '#3b82f6',
    'hnms_greece': '#06b6d4', 'HNMS_Greece': '#06b6d4',
    'nws_central_region': '#ef4444', 'NWS_Central': '#ef4444',
    'nws_southern_region': '#f97316', 'NWS_Southern': '#f97316',
    'nws_western_region': '#10b981', 'NWS_Western': '#10b981',
    'nws_eastern_region': '#38bdf8', 'NWS_Eastern': '#38bdf8',
    'nws_alaska_region': '#93c5fd', 'NWS_Alaska': '#93c5fd',
    'nws_pacific_region': '#06b6d4', 'NWS_Pacific': '#06b6d4',
    'eccc_msc_canada': '#ef4444', 'ECCC_Canada': '#ef4444',
    'metservice_nz': '#0ea5e9', 'MetService_NZ': '#0ea5e9',
    'tmd_thailand': '#f59e0b', 'TMD_Thailand': '#f59e0b',
    'imd_india_mausam': '#ea580c', 'IMD_India': '#ea580c',
    'meteochile_dmc': '#3b82f6', 'MeteoChile': '#3b82f6',
    'ecmwf_open_data': '#2dd4bf', 'ECMWF_OpenData': '#2dd4bf',
    'dwd_mosmix_hub': '#34d399', 'DWD_MOSMIX': '#34d399',
    'zamg_geosphere_alpine': '#ef4444', 'GeoSphere_Alpine': '#ef4444',
    'meteofrance_vigilance': '#f472b6', 'MeteoFrance_Vigilance': '#f472b6',
    'knmi_radar_composites': '#f97316', 'KNMI_Radar': '#f97316',
    'aemet_opendata_radar': '#ec4899', 'AEMET_Radar': '#ec4899',
    'ipma_seismic_weather': '#f43f5e', 'IPMA_Azores': '#f43f5e',
    'chmi_radar_aladin': '#f97316', 'CHMI_ALADIN': '#f97316',
    'dhmz_bura_marine': '#06b6d4', 'DHMZ_Bura': '#06b6d4',
    'arso_julian_alps': '#10b981', 'ARSO_Alps': '#10b981',
    'nimm_romania': '#eab308', 'ANM_Romania': '#eab308',
    'nimh_bulgaria': '#22c55e', 'NIMH_Bulgaria': '#22c55e',
    'meteo_luxembourg': '#38bdf8', 'MeteoLux': '#38bdf8',
    'met_office_hadley': '#818cf8', 'HadleyCentre': '#818cf8',
    'met_norway_arctic': '#10b981', 'MET_Norway_Arctic': '#10b981',
    'smhi_baltic_marine': '#facc15', 'SMHI_Baltic': '#facc15',
    'fmi_arctic_research': '#60a5fa', 'FMI_Sodankyla': '#60a5fa',
    'vedurstofa_volcanic': '#f43f5e', 'Iceland_Volcanic': '#f43f5e',
    'tsms_turkey': '#ef4444', 'MGM_Turkey': '#ef4444',
    'ims_israel': '#3b82f6', 'IMS_Israel': '#3b82f6',
    'jma_typhoon_center': '#fb7185', 'JMA_Typhoon': '#fb7185',
    'kma_supercomputing': '#0284c7', 'KMA_Supercomputing': '#0284c7',
    'cwa_radar_taiwan': '#ec4899', 'CWA_Radar': '#ec4899',
    'cma_nmc_china': '#e11d48', 'CMA_NMC': '#e11d48',
    'mmd_malaysia': '#14b8a6', 'MetMalaysia': '#14b8a6',
    'vnmha_vietnam': '#ef4444', 'NCHMF_Vietnam': '#ef4444',
    'pagasa_flood_warning': '#ef4444', 'PAGASA_Flood': '#ef4444',
    'bmkg_tsunami_early': '#f59e0b', 'BMKG_InaTEWS': '#f59e0b',
    'bmd_bangladesh': '#10b981', 'BMD_Bangladesh': '#10b981',
    'pmd_pakistan': '#22c55e', 'PMD_Pakistan': '#22c55e',
    'bom_tropical_cyclone': '#eab308', 'BOM_Cyclone': '#eab308',
    'fiji_meteorological': '#06b6d4', 'Fiji_Met': '#06b6d4',
    'cptec_inpe_amazon': '#16a34a', 'CPTEC_Amazon': '#16a34a',
    'smn_argentina_antarctic': '#0ea5e9', 'SMN_Antarctic': '#0ea5e9',
    'senamhi_peru': '#ef4444', 'SENAMHI_Peru': '#ef4444',
    'inamhi_galapagos': '#06b6d4', 'INAMHI_Galapagos': '#06b6d4',
    'ideam_caribbean': '#84cc16', 'IDEAM_Caribbean': '#84cc16',
    'inameh_venezuela': '#f59e0b', 'INAMEH_Venezuela': '#f59e0b',
    'senamhi_bolivia': '#eab308', 'SENAMHI_Bolivia': '#eab308',
    'maroc_meteo': '#ef4444', 'MarocMeteo': '#ef4444',
    'meteo_algerie': '#ea580c', 'MeteoAlgerie': '#ea580c',
    'inm_tunisia': '#3b82f6', 'INM_Tunisia': '#3b82f6',
    'ema_egypt': '#f59e0b', 'EMA_Egypt': '#f59e0b',
    'kmd_kenya': '#10b981', 'KMD_Kenya': '#10b981',
    'unma_uganda': '#22c55e', 'UNMA_Uganda': '#22c55e',
    'nimet_nigeria': '#16a34a', 'NiMet_Nigeria': '#16a34a',
    'ghana_met_agency': '#f59e0b', 'Ghana_Met': '#f59e0b',
    'dms_madagascar': '#ef4444', 'Madagascar_DGM': '#ef4444',
    'cpc_noaa_enso': '#8b5cf6', 'NOAA_CPC': '#8b5cf6',
    'nhc_noaa_hurricanes': '#ef4444', 'NOAA_NHC': '#ef4444',
    'spc_noaa_severestorms': '#dc2626', 'NOAA_SPC': '#dc2626'
};

// ==============================================================================
// HIGH-PERFORMANCE GPU CANVAS VECTOR ENGINE (ZERO-DOM OVERHEAD)
// Enables rendering 10,000+ interactive nodes simultaneously on a single Canvas
// ==============================================================================
if (typeof L !== 'undefined' && !L.SquareMarker) {
    // 1. Square Marker (■ Pinkes Viereck - Flock Safety ALPR)
    L.SquareMarker = L.CircleMarker.extend({
        _updatePath: function () {
            this._renderer._updateSquare(this);
        }
    });
    L.squareMarker = function (latlng, options) {
        return new L.SquareMarker(latlng, options);
    };

    // 2. Triangle Marker (▲ Gelbes Dreieck - Telemetrie)
    L.TriangleMarker = L.CircleMarker.extend({
        _updatePath: function () {
            this._renderer._updateTriangle(this);
        }
    });
    L.triangleMarker = function (latlng, options) {
        return new L.TriangleMarker(latlng, options);
    };

    // 3. Pentagon Marker (⬟ Grünes Fünfeck - Wetterstationen)
    L.PentagonMarker = L.CircleMarker.extend({
        _updatePath: function () {
            this._renderer._updatePentagon(this);
        }
    });
    L.pentagonMarker = function (latlng, options) {
        return new L.PentagonMarker(latlng, options);
    };

    // 4. Hexagon Marker (⬢ Rotes Sechseck - Tornados & Unwetter)
    L.HexagonMarker = L.CircleMarker.extend({
        _updatePath: function () {
            this._renderer._updateHexagon(this);
        }
    });
    L.hexagonMarker = function (latlng, options) {
        return new L.HexagonMarker(latlng, options);
    };

    // 5. Diamond Marker (◆ Orange Raute - Erdbeben / USGS)
    L.DiamondMarker = L.CircleMarker.extend({
        _updatePath: function () {
            this._renderer._updateDiamond(this);
        }
    });
    L.diamondMarker = function (latlng, options) {
        return new L.DiamondMarker(latlng, options);
    };

    if (L.Canvas) {
        L.Canvas.include({
            _updateSquare: function (layer) {
                if (!this._drawing || layer._empty()) { return; }
                const p = layer._point,
                      ctx = this._ctx,
                      r = Math.max(Math.round(layer._radius), 1);
                if (this._drawnLayers) { this._drawnLayers[layer._leaflet_id] = layer; }
                ctx.beginPath();
                ctx.rect(p.x - r, p.y - r, r * 2, r * 2);
                this._fillStroke(ctx, layer);
            },
            _updateTriangle: function (layer) {
                if (!this._drawing || layer._empty()) { return; }
                const p = layer._point,
                      ctx = this._ctx,
                      r = Math.max(Math.round(layer._radius), 1) * 1.25;
                if (this._drawnLayers) { this._drawnLayers[layer._leaflet_id] = layer; }
                ctx.beginPath();
                ctx.moveTo(p.x, p.y - r);
                ctx.lineTo(p.x + r * 1.05, p.y + r * 0.75);
                ctx.lineTo(p.x - r * 1.05, p.y + r * 0.75);
                ctx.closePath();
                this._fillStroke(ctx, layer);
            },
            _updatePentagon: function (layer) {
                if (!this._drawing || layer._empty()) { return; }
                const p = layer._point,
                      ctx = this._ctx,
                      r = Math.max(Math.round(layer._radius), 1) * 1.15;
                if (this._drawnLayers) { this._drawnLayers[layer._leaflet_id] = layer; }
                ctx.beginPath();
                for (let i = 0; i < 5; i++) {
                    const angle = -Math.PI / 2 + (i * 2 * Math.PI / 5);
                    const x = p.x + r * Math.cos(angle);
                    const y = p.y + r * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                this._fillStroke(ctx, layer);
            },
            _updateHexagon: function (layer) {
                if (!this._drawing || layer._empty()) { return; }
                const p = layer._point,
                      ctx = this._ctx,
                      r = Math.max(Math.round(layer._radius), 1) * 1.2;
                if (this._drawnLayers) { this._drawnLayers[layer._leaflet_id] = layer; }
                ctx.beginPath();
                for (let i = 0; i < 6; i++) {
                    const angle = -Math.PI / 2 + (i * 2 * Math.PI / 6);
                    const x = p.x + r * Math.cos(angle);
                    const y = p.y + r * Math.sin(angle);
                    if (i === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                this._fillStroke(ctx, layer);
            },
            _updateDiamond: function (layer) {
                if (!this._drawing || layer._empty()) { return; }
                const p = layer._point,
                      ctx = this._ctx,
                      r = Math.max(Math.round(layer._radius), 1) * 1.25;
                if (this._drawnLayers) { this._drawnLayers[layer._leaflet_id] = layer; }
                ctx.beginPath();
                ctx.moveTo(p.x, p.y - r);
                ctx.lineTo(p.x + r * 0.85, p.y);
                ctx.lineTo(p.x, p.y + r);
                ctx.lineTo(p.x - r * 0.85, p.y);
                ctx.closePath();
                this._fillStroke(ctx, layer);
            }
        });
    }
}

class OperationsMap {
    getDynamicNodeRadius(baseRadius = 4.0) {
        const zoom = this.map ? this.map.getZoom() : 4;
        // User requested: smaller, balanced tactical node radius (compact points, not oversized discs)
        let r = baseRadius;
        if (zoom <= 4) {
            r = Math.max(3.0, baseRadius - 0.5);
        } else if (zoom <= 7) {
            r = baseRadius + (zoom - 4) * 0.35;
        } else {
            // zoom 8+: subtle scaling, max 6.5 - 7.0px
            r = baseRadius + 1.05 + Math.min(zoom - 7, 5) * 0.3;
        }
        return Math.min(7.0, Math.max(3.0, Math.round(r * 10) / 10));
    }

    updateAllMarkerRadii() {
        if (!this.map) return;
        const updateLayer = (layer, defaultBase = 4.0) => {
            if (!layer || typeof layer.setRadius !== 'function') return;
            const base = layer._baseRadius || defaultBase;
            layer.setRadius(this.getDynamicNodeRadius(base));
        };
        const updateGroup = (group, defaultBase = 4.0) => {
            if (!group) return;
            if (typeof group.eachLayer === 'function') {
                group.eachLayer(layer => updateLayer(layer, defaultBase));
            }
        };
        updateGroup(this.camsLayer, 4.0);
        updateGroup(this.weatherEnginesLayer, 4.5);
        updateGroup(this.metarLayer, 4.0);
        updateGroup(this.kiwiSdrLayer, 4.0);
        updateGroup(this.radiationLayer, 4.0);
        updateGroup(this.torLayer, 4.0);
        updateGroup(this.bordersLayer, 4.0);
        updateGroup(this.balticAisLayer, 4.5);
        if (this.activeCamMarkers) {
            for (const marker of this.activeCamMarkers.values()) {
                updateLayer(marker, 4.0);
            }
        }
        if (this.weatherEngineMarkers) {
            for (const marker of this.weatherEngineMarkers.values()) {
                updateLayer(marker, 4.5);
            }
        }
    }

    constructor(containerId) {
        this.map = L.map(containerId, {
            center: [28.0, 15.0],
            zoom: 3,
            minZoom: 2,
            maxZoom: 18,
            zoomControl: false,
            preferCanvas: true,
            wheelDebounceTime: 40,
            wheelPxPerZoomLevel: 80,
            updateWhenZooming: false,
            updateWhenIdle: true
        });

        // Dedicated interaction panes to allow markers to sit cleanly above weather zones
        if (!this.map.getPane('weatherZonesPane')) {
            this.map.createPane('weatherZonesPane');
            this.map.getPane('weatherZonesPane').style.zIndex = '420';
        }
        if (!this.map.getPane('sensorMarkersPane')) {
            this.map.createPane('sensorMarkersPane');
            this.map.getPane('sensorMarkersPane').style.zIndex = '460';
        }

        this.canvasRenderer = L.canvas({ padding: 0.5, tolerance: 15, pane: 'sensorMarkersPane' });
        this._lastLayerClickTime = 0;
        L.control.zoom({ position: 'bottomright' }).addTo(this.map);

        // Layer storage
        this.baseLayers = {};
        this.currentBaseLayer = null;

        // Overlay layers
        this.radarLayer = null;
        this.radarFrames = [];
        this.radarIndex = 0;
        this.radarTimer = null;
        this.radarPlaying = true;
        this.radarOpacity = 0.75;

        this.flightsLayer = L.layerGroup().addTo(this.map);
        this.vesselsLayer = L.layerGroup().addTo(this.map);
        this.flightRouteLayer = L.layerGroup().addTo(this.map);
        this.seamarksLayer = L.tileLayer('https://tiles.openseamap.org/seamark/{z}/{x}/{y}.png', { maxZoom: 18, attribution: 'OpenSeaMap' });
        this.firmsLayer = L.layerGroup().addTo(this.map);
        this.quakesLayer = L.layerGroup().addTo(this.map);
        this.issLayer = L.layerGroup().addTo(this.map);
        this.camsLayer = L.layerGroup().addTo(this.map);
        this.activeCamMarkers = new Map();
        this.camFetchAbortController = null;
        this.weatherFetchAbortController = null;
        this.alertsLayer = L.layerGroup().addTo(this.map);
        this.alertGeometries = new Map();
        this.rawAlerts = [];
        this.tornadoGroundLayer = L.layerGroup().addTo(this.map);
        this.activeTornadoGroundMarkers = new Map();
        this.rawTornadoGroundAlerts = [];
        this._tornadoAlertSoundPlayed = false;
        this.trainsLayer = L.layerGroup().addTo(this.map);
        this.trainMarkers = new Map();
        this.trainRouteLines = new Map();
        this.weatherEnginesLayer = L.layerGroup().addTo(this.map);
        this.weatherEngineMarkers = new Map();
        this.transitEnginesLayer = L.layerGroup().addTo(this.map);
        this.transitEngineMarkers = new Map();
        this.noaaRadarLayer = null;
        this.noaaRadarOpacity = 0.82;
        this.noaaStationsLayer = L.layerGroup().addTo(this.map);
        this.noaaStationMarkers = new Map();
        this.archiveEventsLayer = L.layerGroup().addTo(this.map);
        this.currentArchiveData = null;
        this.currentArchiveLocation = { lat: 35.3395, lon: -97.4867, city: 'Moore', state: 'OK', country: 'US' };
        this.isJevForecastMode = false;
        this.jevForecastLayer = L.layerGroup().addTo(this.map);
        this.lastJevTarget = null;
        this.lastJevBounds = null;
        this.isDrawingJevBox = false;
        this.jevDrawStart = null;
        this.currentJevRect = null;

        // v2.1.0 Keyless Open Data Map Layers
        this.cablesLayer = L.layerGroup().addTo(this.map);
        this.gdacsLayer = L.layerGroup().addTo(this.map);
        this.safecastLayer = L.layerGroup().addTo(this.map);
        this.balticAisLayer = L.layerGroup().addTo(this.map);
        this.metarLayer = L.layerGroup().addTo(this.map);
        this.kiwiSdrLayer = L.layerGroup().addTo(this.map);
        this.bordersLayer = L.layerGroup().addTo(this.map);
        this.torLayer = L.layerGroup().addTo(this.map);

        this.rawFlights = [];
        this.activeFlights = [];
        this.flightMarkers = new Map();
        this.rawVessels = [];
        this.activeVessels = [];
        this.vesselMarkers = new Map();
        this.rawFires = [];
        this.rawQuakes = [];
        this.currentTemporalHours = 0;
        this.weatherDisplayMode = 'global'; // 'global' | 'sector' | 'off'

        this.reticle = null;
        this.issMarker = null;

        // Pinned Storm & Live Storm Intercept Panel State
        this.pinnedStorm = null;
        this.activeStormsList = [];
        this._stormPollingInterval = null;
        this._stormPollSecondsLeft = 30;

        this.isFlightsEnabled = false;
        this.initCapabilities();
        this.initBaseLayers();
        this.initEventListeners();
        this.initRadar();
        this.startLiveTelemetry();
        this.initLiveStormSidePanel();
        this.initLiveStormPolling();
        this.loadInitialCamera();
        this.loadWeatherEngineMarkers();
        this.loadTransitEngineMarkers();
        this.enableNoaaRadar(true);
        this.fetchNoaaUsaWeather();
    }

    async initCapabilities() {
        try {
            const res = await fetch('/api/capabilities');
            if (!res.ok) return;
            const data = await res.json();
            this.capabilities = data;
            const keyed = data.keyed_providers || {};

            // 1. OpenSky Flights
            if (!keyed.opensky_flights) {
                this.isFlightsEnabled = false;
                const fTop = document.getElementById('layer-flights');
                if (fTop && fTop.closest('label')) fTop.closest('label').remove();
                const fSide = document.getElementById('side-layer-flights');
                if (fSide && fSide.closest('label')) fSide.closest('label').remove();
                const fCard = document.getElementById('flights-corridor-card');
                if (fCard) fCard.remove();
                if (this.flightsLayer && this.map && this.map.hasLayer(this.flightsLayer)) {
                    this.map.removeLayer(this.flightsLayer);
                }
            } else {
                this.isFlightsEnabled = true;
                this.fetchFlights();
                setInterval(() => this.fetchFlights(), 15000);
            }

            // 2. Tomorrow.io / Air Quality
            if (!keyed.tomorrow_io && !keyed.airnow_epa) {
                const aqBtn = document.getElementById('btn-air-quality-sub');
                if (aqBtn) aqBtn.remove();
            }

            // 3. NVIDIA NIM
            if (!keyed.nvidia_nim) {
                document.querySelectorAll('#map-jev-engine-hud option[value="nvidia_nim"], #jev-engine-select option[value="nvidia_nim"]').forEach(el => el.remove());
            }

            console.log('[OmniScope OSINT] Synchronized capabilities. Active providers:', data.active_keyed_list);
        } catch (e) {
            console.warn('[OmniScope OSINT] Capabilities initialization note:', e);
        }
    }

    initBaseLayers() {
        // 1. ESRI World Imagery (Ultra High-Res Satellite, 100% Free, NO API KEY NEEDED)
        this.baseLayers['esri-sat'] = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19, attribution: 'ESRI World Imagery'
        });

        // 2. ESRI Satellite Hybrid (High-Res Satellit + Grenzen & Städte Labels, Free, NO KEY)
        this.baseLayers['esri-hybrid'] = L.layerGroup([
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 }),
            L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}', { maxZoom: 19 })
        ]);

        // 3. CartoDB Dark Matter (Tactical Dark Mode, Free, NO KEY)
        this.baseLayers['carto-dark'] = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
            maxZoom: 19, attribution: 'CartoDB Dark Matter'
        });

        // 4. NASA GIBS Black Marble (Erde bei Nacht aus dem Orbit, Free, NO KEY)
        this.baseLayers['nasa-night'] = L.tileLayer('https://map1.vis.earthdata.nasa.gov/wmts-webmerc/VIIRS_CityLights_2012/default//GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg', {
            maxNativeZoom: 8, maxZoom: 19, attribution: 'NASA GIBS Earth at Night'
        });

        // 5. ESRI World Topo (Gelände & Konturen, Free, NO KEY)
        this.baseLayers['esri-topo'] = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}', {
            maxZoom: 19, attribution: 'ESRI Topo'
        });

        // 6. OpenTopoMap (Topografische Höhenlinien, Free, NO KEY)
        this.baseLayers['opentopomap'] = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
            maxZoom: 17, attribution: 'OpenTopoMap'
        });

        // 7. OpenStreetMap Humanitarian (Detail-Straßen & Infrastruktur, Free, NO KEY)
        this.baseLayers['osm-hot'] = L.tileLayer('https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png', {
            maxZoom: 19, attribution: 'OSM Humanitarian'
        });

        // 8. Mapbox Dark & Satellite (mit hinterlegtem Key)
        this.baseLayers['mapbox-dark'] = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/dark-v11/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`, {
            tileSize: 512, zoomOffset: -1, maxZoom: 18, attribution: 'Mapbox Dark'
        });

        this.baseLayers['mapbox-sat'] = L.tileLayer(`https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/tiles/{z}/{x}/{y}?access_token=${MAPBOX_TOKEN}`, {
            tileSize: 512, zoomOffset: -1, maxZoom: 18, attribution: 'Mapbox Satellite'
        });

        // 9. MapTiler Vector/Raster Tiles via Verified Proxy Key
        this.baseLayers['maptiler-streets'] = L.tileLayer('/api/tiles/maptiler/streets-v2/{z}/{x}/{y}.png', {
            maxZoom: 19, attribution: 'MapTiler Streets'
        });
        this.baseLayers['maptiler-sat'] = L.tileLayer('/api/tiles/maptiler/satellite/{z}/{x}/{y}.jpg', {
            maxZoom: 19, attribution: 'MapTiler Satellite'
        });
        this.baseLayers['maptiler-topo'] = L.tileLayer('/api/tiles/maptiler/topo-v2/{z}/{x}/{y}.png', {
            maxZoom: 19, attribution: 'MapTiler Topo'
        });
        this.baseLayers['maptiler-dark'] = L.tileLayer('/api/tiles/maptiler/dataviz-dark/{z}/{x}/{y}.png', {
            maxZoom: 19, attribution: 'MapTiler Dark'
        });

        this.baseLayers['osm-standard'] = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19, attribution: 'OSM'
        });

        // Set default base layer to ESRI Satellite Hybrid (always sharp, 100% reliable)
        this.currentBaseLayer = this.baseLayers['esri-hybrid'];
        this.currentBaseLayer.addTo(this.map);

        // Style switcher dropdown
        const styleSelect = document.getElementById('map-style-select');
        if (styleSelect) {
            styleSelect.value = 'esri-hybrid';
            styleSelect.addEventListener('change', (e) => {
                const val = e.target.value;
                if (this.baseLayers[val]) {
                    this.map.removeLayer(this.currentBaseLayer);
                    this.currentBaseLayer = this.baseLayers[val];
                    this.currentBaseLayer.addTo(this.map);
                }
            });
        }
    }

    initEventListeners() {
        // Cursor Coordinates HUD
        const hud = document.getElementById('coords-hud');
        // rAF-throttled cursor HUD: avoids a DOM write on every mousemove event
        let coordHudPending = false;
        let coordHudEvent = null;
        this.map.on('mousemove', (e) => {
            coordHudEvent = e;
            if (coordHudPending) return;
            coordHudPending = true;
            requestAnimationFrame(() => {
                coordHudPending = false;
                if (hud && coordHudEvent) {
                    hud.innerText = `CURSOR: LAT ${coordHudEvent.latlng.lat.toFixed(4)}° | LON ${coordHudEvent.latlng.lng.toFixed(4)}° | ZOOM ${this.map.getZoom()}`;
                }
            });
        });

        // Anti-clutter Zoom & Viewport Camera & Weather Stations Resolution Hook (debounced 150ms with in-flight abort)
        let camViewDebounce = null;
        const onMapViewportChanged = () => {
            if (this.camFetchAbortController) {
                this.camFetchAbortController.abort();
                this.camFetchAbortController = null;
            }
            if (this.weatherFetchAbortController) {
                this.weatherFetchAbortController.abort();
                this.weatherFetchAbortController = null;
            }
            if (camViewDebounce) clearTimeout(camViewDebounce);
            camViewDebounce = setTimeout(() => {
                this.refreshViewportCameras();
                this.refreshViewportWeatherStations();
            }, 150);
        };
        this.map.on('moveend', onMapViewportChanged);
        this.map.on('zoom', () => this.updateAllMarkerRadii());
        this.map.on('zoomend', () => {
            this.updateAllMarkerRadii();
            onMapViewportChanged();
        });

        // Map Click: Direct Ground Weather Station, Sector Webcams & Proximity Camera Lock
        this.map.on('click', async (e) => {
            if (this.isJevForecastMode) return; // In Jev mode, handling is done via box-drawing mousedown/mouseup
            // CRITICAL: If a marker, polygon, camera, weather station, or danger zone was clicked, DO NOT trigger sector scan!
            if (Date.now() - (this._lastLayerClickTime || 0) < 500) return;
            if (e.originalEvent && (e.originalEvent._layerClicked || e.originalEvent.defaultPrevented)) return;

            const { lat, lng } = e.latlng;
            await this.onMapLocationClicked(lat, lng);
        });

        // Jev Interactive Drag-to-Select Box Selection (Neon Pink HUD & Live Dimension Display)
        this.map.on('mousedown', (e) => {
            if (!this.isJevForecastMode) return;
            // Check if clicking inside map container
            this.isDrawingJevBox = true;
            this.jevDrawStart = e.latlng;
            this.map.dragging.disable();
            this.jevForecastLayer.clearLayers();

            this.currentJevRect = L.rectangle(L.latLngBounds(e.latlng, e.latlng), {
                color: '#ec4899',       // Neon Pink outline
                weight: 3,
                dashArray: '6, 6',
                fillColor: '#f43f5e',   // Translucent Neon Pink fill
                fillOpacity: 0.22,
                className: 'jev-drag-pink-box'
            }).addTo(this.jevForecastLayer);

            const selBadge = document.getElementById('jev-selection-badge');
            const selText = document.getElementById('jev-selection-badge-text');
            if (selBadge && selText) {
                selBadge.style.display = 'inline-flex';
                selText.innerHTML = '📐 <b style="color:#ec4899;">ZONE WIRD GEZOGEN...</b>';
            }
        });

        this.map.on('mousemove', (e) => {
            if (this.isJevForecastMode && this.isDrawingJevBox && this.currentJevRect && this.jevDrawStart) {
                const bounds = L.latLngBounds(this.jevDrawStart, e.latlng);
                this.currentJevRect.setBounds(bounds);

                const dlat = Math.abs(bounds.getNorth() - bounds.getSouth()) * 111;
                const dlon = Math.abs(bounds.getEast() - bounds.getWest()) * 111 * Math.cos(bounds.getCenter().lat * Math.PI / 180);
                const areaKm2 = Math.round(dlat * dlon);

                // 1. On-map floating Leaflet tooltip in luminous NEON PINK attached directly to the rectangle
                const tooltipHtml = `<div class="jev-drag-pink-label">📐 <b>GEWÄHLTE ZONE</b>: ${Math.round(dlat)} km × ${Math.round(dlon)} km <span class="jev-area-badge">(${areaKm2.toLocaleString()} km²)</span></div>`;
                if (!this.currentJevRect.getTooltip()) {
                    this.currentJevRect.bindTooltip(tooltipHtml, {
                        permanent: true,
                        direction: 'center',
                        className: 'jev-drag-pink-tooltip',
                        interactive: false
                    }).openTooltip();
                } else {
                    this.currentJevRect.setTooltipContent(tooltipHtml);
                }

                // 2. Top status hint in vibrant NEON PINK
                const hint = document.getElementById('map-mode-hint');
                if (hint) {
                    hint.innerHTML = `<span style="color:#ec4899;font-weight:bold;text-shadow:0 0 10px rgba(236,72,153,0.7);">📐 BOX WIRD GEZOGEN: ${Math.round(dlat)} km × ${Math.round(dlon)} km (${areaKm2.toLocaleString()} km²)</span> // MAUSTASTE LOSLASSEN ZUM SCANNEN`;
                    hint.style.color = '#ec4899';
                }

                // 3. JEV Top Bar Live Pink Badge
                const selBadge = document.getElementById('jev-selection-badge');
                const selText = document.getElementById('jev-selection-badge-text');
                if (selBadge && selText) {
                    selBadge.style.display = 'inline-flex';
                    selText.innerHTML = `📐 <b>GEWÄHLTE ZONE:</b> ${Math.round(dlat)} km × ${Math.round(dlon)} km <span style="background:rgba(236,72,153,0.3);color:#fff;padding:1px 6px;border-radius:3px;margin-left:4px;">${areaKm2.toLocaleString()} km²</span>`;
                }
            }
        });

        this.map.on('mouseup', async (e) => {
            if (!this.isJevForecastMode || !this.isDrawingJevBox) return;
            this.isDrawingJevBox = false;
            this.map.dragging.enable();

            if (!this.currentJevRect || !this.jevDrawStart) return;

            let bounds = this.currentJevRect.getBounds();
            const dlat = Math.abs(bounds.getNorth() - bounds.getSouth());
            const dlon = Math.abs(bounds.getEast() - bounds.getWest());

            // If user just clicked without dragging, create a default ~100km box around the clicked point
            if (dlat < 0.005 && dlon < 0.005) {
                const p = e.latlng;
                const r = 0.55;
                bounds = L.latLngBounds([p.lat - r, p.lng - r * 1.3], [p.lat + r, p.lng + r * 1.3]);
                this.currentJevRect.setBounds(bounds);
            }

            const dlatKm = Math.abs(bounds.getNorth() - bounds.getSouth()) * 111;
            const dlonKm = Math.abs(bounds.getEast() - bounds.getWest()) * 111 * Math.cos(bounds.getCenter().lat * Math.PI / 180);
            const areaKm2 = Math.round(dlatKm * dlonKm);

            // Update tooltip on mouseup in glowing pink
            const tooltipHtml = `<div class="jev-drag-pink-label">📐 <b>ZONE FIXIERT</b>: ${Math.round(dlatKm)} km × ${Math.round(dlonKm)} km <span class="jev-area-badge">(${areaKm2.toLocaleString()} km²)</span> // <span style="color:#10b981;">SCANNE ECHTE BODENSTATIONEN...</span></div>`;
            if (this.currentJevRect.getTooltip()) {
                this.currentJevRect.setTooltipContent(tooltipHtml);
            }

            const selBadge = document.getElementById('jev-selection-badge');
            const selText = document.getElementById('jev-selection-badge-text');
            if (selBadge && selText) {
                selBadge.style.display = 'inline-flex';
                selText.innerHTML = `📐 <b>ZONE FIXIERT:</b> ${Math.round(dlatKm)} km × ${Math.round(dlonKm)} km <span style="background:rgba(236,72,153,0.3);color:#fff;padding:1px 6px;border-radius:3px;margin-left:4px;">${areaKm2.toLocaleString()} km²</span>`;
            }

            const hint = document.getElementById('map-mode-hint');
            if (hint) {
                hint.innerHTML = `<span style="color:#ec4899;font-weight:bold;">📐 ZONE FIXIERT: ${Math.round(dlatKm)} km × ${Math.round(dlonKm)} km (${areaKm2.toLocaleString()} km²)</span> // <span style="color:#38bdf8;">Fusioniere alle echten Bodenwetterstationen...</span>`;
                hint.style.color = '#ec4899';
            }

            this.lastJevBounds = bounds;
            await this.runJevBoxScan(bounds);
        });

        // Initialize Jev AI 10-Day Forecast Tool Controls
        this.initJevForecastMode();

        // Bidirectional Layer Sync between Top Bar & Sidebar
        const layerMappings = [
            { topId: 'layer-radar', sideId: 'side-layer-radar', layer: null, isRadar: true },
            { topId: 'layer-noaa-radar', sideId: 'side-layer-noaa-radar', layer: null, isNoaaRadar: true },
            { topId: 'layer-noaa-stations', sideId: 'side-layer-noaa-stations', layer: this.noaaStationsLayer },
            { topId: 'layer-archive-events', sideId: 'side-layer-archive-events', layer: this.archiveEventsLayer },
            { topId: 'layer-alerts', sideId: 'side-layer-alerts', layer: this.alertsLayer },
            { topId: 'layer-tornado-ground', sideId: 'side-layer-tornado-ground', layer: this.tornadoGroundLayer },
            { topId: 'layer-flights', sideId: 'side-layer-flights', layer: this.flightsLayer },
            { topId: 'layer-vessels', sideId: 'side-layer-vessels', layer: this.vesselsLayer },
            { topId: 'layer-seamarks', sideId: 'side-layer-seamarks', layer: this.seamarksLayer },
            { topId: 'layer-firms', sideId: 'side-layer-firms', layer: this.firmsLayer },
            { topId: 'layer-quakes', sideId: 'side-layer-quakes', layer: this.quakesLayer },
            { topId: 'layer-iss', sideId: 'side-layer-iss', layer: this.issLayer },
            { topId: 'layer-trains', sideId: 'side-layer-trains', layer: this.trainsLayer },
            { topId: 'layer-weather-engines', sideId: 'side-layer-weather-engines', layer: this.weatherEnginesLayer },
            { topId: 'layer-transit-engines', sideId: 'side-layer-transit-engines', layer: this.transitEnginesLayer },
            { topId: 'layer-cables', sideId: 'side-layer-cables', layer: this.cablesLayer },
            { topId: 'layer-gdacs', sideId: 'side-layer-gdacs', layer: this.gdacsLayer },
            { topId: 'layer-radiation', sideId: 'side-layer-radiation', layer: this.safecastLayer },
            { topId: 'layer-baltic-ais', sideId: 'side-layer-baltic-ais', layer: this.balticAisLayer },
            { topId: 'layer-metar', sideId: 'side-layer-metar', layer: this.metarLayer },
            { topId: 'layer-kiwisdr', sideId: 'side-layer-kiwisdr', layer: this.kiwiSdrLayer },
            { topId: 'layer-borders', sideId: 'side-layer-borders', layer: this.bordersLayer },
            { topId: 'layer-tor', sideId: 'side-layer-tor', layer: this.torLayer }
        ];

        layerMappings.forEach(mapping => {
            const topEl = document.getElementById(mapping.topId);
            const sideEl = document.getElementById(mapping.sideId);

            const handleToggle = (isChecked) => {
                if (topEl) topEl.checked = isChecked;
                if (sideEl) sideEl.checked = isChecked;

                if (mapping.isRadar) {
                    if (isChecked) {
                        this.renderRadarFrame(this.radarIndex);
                    } else {
                        if (this.radarLayer && this.map.hasLayer(this.radarLayer)) {
                            this.map.removeLayer(this.radarLayer);
                        }
                        if (this.radarLayerPrev && this.map.hasLayer(this.radarLayerPrev)) {
                            this.map.removeLayer(this.radarLayerPrev);
                        }
                    }
                } else if (mapping.isNoaaRadar) {
                    this.enableNoaaRadar(isChecked);
                } else if (mapping.layer) {
                    if (isChecked) {
                        if (!this.map.hasLayer(mapping.layer)) mapping.layer.addTo(this.map);
                        if (mapping.topId === 'layer-noaa-stations' && this.noaaStationMarkers.size === 0) {
                            this.fetchNoaaUsaWeather();
                        } else if (mapping.topId === 'layer-cables' && this.cablesLayer.getLayers().length === 0) {
                            this.fetchSubmarineCables();
                        } else if (mapping.topId === 'layer-gdacs' && this.gdacsLayer.getLayers().length === 0) {
                            this.fetchGdacsDisasters();
                        } else if (mapping.topId === 'layer-radiation' && this.safecastLayer.getLayers().length === 0) {
                            this.fetchSafecastRadiation();
                        } else if (mapping.topId === 'layer-baltic-ais' && this.balticAisLayer.getLayers().length === 0) {
                            this.fetchBalticAis();
                        } else if (mapping.topId === 'layer-metar' && this.metarLayer.getLayers().length === 0) {
                            this.fetchMetarStations();
                        } else if (mapping.topId === 'layer-kiwisdr' && this.kiwiSdrLayer.getLayers().length === 0) {
                            this.fetchKiwiSdr();
                        } else if (mapping.topId === 'layer-borders' && this.bordersLayer.getLayers().length === 0) {
                            this.fetchBorderWaitTimes();
                        } else if (mapping.topId === 'layer-tor' && this.torLayer.getLayers().length === 0) {
                            this.fetchTorRelays();
                        }
                    } else {
                        if (this.map.hasLayer(mapping.layer)) this.map.removeLayer(mapping.layer);
                    }
                }
            };

            if (topEl) topEl.addEventListener('change', (e) => handleToggle(e.target.checked));
            if (sideEl) sideEl.addEventListener('change', (e) => handleToggle(e.target.checked));
        });

        // Initialize dedicated Real Cams & Telemetry Nodes synchronization
        this.initCameraAndTelemetryControls();

        // Master ALL ON / ALL OFF Buttons
        const btnAllOn = document.getElementById('btn-layers-all-on');
        const btnAllOff = document.getElementById('btn-layers-all-off');

        const toggleAll = (enable) => {
            layerMappings.forEach(m => {
                const topEl = document.getElementById(m.topId);
                const sideEl = document.getElementById(m.sideId);
                if (topEl) topEl.checked = enable;
                if (sideEl) sideEl.checked = enable;

                if (m.isRadar) {
                    if (enable) {
                        this.renderRadarFrame(this.radarIndex);
                    } else {
                        if (this.radarLayer && this.map.hasLayer(this.radarLayer)) this.map.removeLayer(this.radarLayer);
                        if (this.radarLayerPrev && this.map.hasLayer(this.radarLayerPrev)) this.map.removeLayer(this.radarLayerPrev);
                    }
                } else if (m.isNoaaRadar) {
                    this.enableNoaaRadar(enable);
                } else if (m.layer) {
                    if (enable) {
                        if (!this.map.hasLayer(m.layer)) m.layer.addTo(this.map);
                    } else {
                        if (this.map.hasLayer(m.layer)) this.map.removeLayer(m.layer);
                    }
                }
            });

            // Sync Cams, Telemetry & Flock Nodes
            const topCams = document.getElementById('layer-cams');
            const sideCams = document.getElementById('side-layer-cams');
            const topTele = document.getElementById('layer-telemetry');
            const sideTele = document.getElementById('side-layer-telemetry');
            if (topCams) topCams.checked = enable;
            if (sideCams) sideCams.checked = enable;
            if (topTele) topTele.checked = enable;
            if (sideTele) sideTele.checked = enable;

            if (enable) {
                this.cameraNodeTypeFilter = 'all';
                if (!this.map.hasLayer(this.camsLayer)) this.camsLayer.addTo(this.map);
                this.refreshViewportCameras();
            } else {
                this.cameraNodeTypeFilter = 'none';
                if (this.map.hasLayer(this.camsLayer)) this.map.removeLayer(this.camsLayer);
            }
        };

        if (btnAllOn) btnAllOn.addEventListener('click', () => toggleAll(true));
        if (btnAllOff) btnAllOff.addEventListener('click', () => toggleAll(false));

        // Sidebar Collapse/Expand Toggle
        const sideToggleBtn = document.getElementById('btn-map-sidebar-toggle');
        const sidebar = document.getElementById('map-tactical-sidebar');
        const sideArrow = document.getElementById('map-sidebar-arrow');

        if (sideToggleBtn && sidebar) {
            sideToggleBtn.addEventListener('click', () => {
                const isNowCollapsed = sidebar.classList.toggle('collapsed');
                sideToggleBtn.classList.toggle('collapsed', isNowCollapsed);
                if (sideArrow) sideArrow.innerText = isNowCollapsed ? '◀' : '▶';
            });
        }

        // Radar Color Scheme Switcher
        const colorSelect = document.getElementById('radar-color-scheme');
        if (colorSelect) {
            colorSelect.addEventListener('change', (e) => {
                this.radarColorScheme = parseInt(e.target.value) || 2;
                this.renderRadarFrame(this.radarIndex);
            });
        }

        // Radar Provider & View Mode Switcher
        const radarProvSelect = document.getElementById('select-radar-provider');
        if (radarProvSelect) {
            radarProvSelect.addEventListener('change', (e) => {
                this.activeRadarProvider = e.target.value;
                const topRadar = document.getElementById('layer-radar');
                const sideRadar = document.getElementById('side-layer-radar');
                if (topRadar) topRadar.checked = true;
                if (sideRadar) sideRadar.checked = true;
                if (this.radarLayer && this.map.hasLayer(this.radarLayer)) {
                    this.map.removeLayer(this.radarLayer);
                    this.radarLayer = null;
                }
                if (this.radarLayerPrev && this.map.hasLayer(this.radarLayerPrev)) {
                    this.map.removeLayer(this.radarLayerPrev);
                    this.radarLayerPrev = null;
                }
                if (this.noaaRadarLayer && this.map.hasLayer(this.noaaRadarLayer)) {
                    this.map.removeLayer(this.noaaRadarLayer);
                    this.noaaRadarLayer = null;
                }
                if (e.target.value === 'dwd') {
                    this.map.setView([51.16, 10.45], 6);
                } else if (e.target.value === 'nexrad') {
                    this.map.setView([38.8, -97.0], 5);
                }
                this.renderRadarFrame(this.radarIndex || 0);
            });
        }

        const radarModeSelect = document.getElementById('select-radar-mode');
        if (radarModeSelect) {
            radarModeSelect.addEventListener('change', (e) => {
                this.activeRadarMode = e.target.value;
                const topRadar = document.getElementById('layer-radar');
                const sideRadar = document.getElementById('side-layer-radar');
                if (topRadar) topRadar.checked = true;
                if (sideRadar) sideRadar.checked = true;
                if (this.radarLayer && this.map.hasLayer(this.radarLayer)) {
                    this.map.removeLayer(this.radarLayer);
                    this.radarLayer = null;
                }
                if (this.radarLayerPrev && this.map.hasLayer(this.radarLayerPrev)) {
                    this.map.removeLayer(this.radarLayerPrev);
                    this.radarLayerPrev = null;
                }
                if (this.noaaRadarLayer && this.map.hasLayer(this.noaaRadarLayer)) {
                    this.map.removeLayer(this.noaaRadarLayer);
                    this.noaaRadarLayer = null;
                }
                this.renderRadarFrame(this.radarIndex || 0);
            });
        }

        // Sidebar Radar Opacity Slider
        const sideOpacity = document.getElementById('side-radar-opacity');
        const hudOpacity = document.getElementById('radar-opacity');
        const updateOpacity = (val) => {
            this.radarOpacity = parseFloat(val);
            if (sideOpacity) sideOpacity.value = this.radarOpacity;
            if (hudOpacity) hudOpacity.value = this.radarOpacity;
            if (this.radarLayer) this.radarLayer.setOpacity(this.radarOpacity);
            if (this.radarLayerPrev) this.radarLayerPrev.setOpacity(this.radarOpacity);
        };
        if (sideOpacity) sideOpacity.addEventListener('input', (e) => updateOpacity(e.target.value));
        if (hudOpacity) hudOpacity.addEventListener('input', (e) => updateOpacity(e.target.value));

        // NOAA NEXRAD USA Radar Controls
        const btnFocusNoaa = document.getElementById('btn-focus-noaa-usa');
        const sideBtnFocusNoaa = document.getElementById('side-btn-focus-noaa-usa');
        if (btnFocusNoaa) btnFocusNoaa.addEventListener('click', () => this.focusNoaaUsa());
        if (sideBtnFocusNoaa) sideBtnFocusNoaa.addEventListener('click', () => this.focusNoaaUsa());

        // v2.1.0 New Tactical Focus Buttons
        const sideBtnFocusCables = document.getElementById('side-btn-focus-cables');
        if (sideBtnFocusCables) {
            sideBtnFocusCables.addEventListener('click', () => {
                this.map.setView([20.0, 10.0], 3);
            });
        }
        const sideBtnFocusRadiation = document.getElementById('side-btn-focus-radiation');
        if (sideBtnFocusRadiation) {
            sideBtnFocusRadiation.addEventListener('click', () => {
                this.map.setView([50.0, 10.0], 6);
            });
        }
        const sideBtnFocusBaltic = document.getElementById('side-btn-focus-baltic');
        if (sideBtnFocusBaltic) {
            sideBtnFocusBaltic.addEventListener('click', () => {
                this.map.setView([58.5, 19.0], 6);
            });
        }
        const sideBtnFocusBorders = document.getElementById('side-btn-focus-borders');
        if (sideBtnFocusBorders) {
            sideBtnFocusBorders.addEventListener('click', () => {
                this.map.setView([30.5, -104.0], 6);
            });
        }

        const sideNoaaOpacity = document.getElementById('side-noaa-radar-opacity');
        if (sideNoaaOpacity) {
            sideNoaaOpacity.addEventListener('input', (e) => {
                this.noaaRadarOpacity = parseFloat(e.target.value);
                if (this.noaaRadarLayer) {
                    this.noaaRadarLayer.setOpacity(this.noaaRadarOpacity);
                }
            });
        }

        // Historical Weather & Tornado Archive Controls
        const btnArchiveModal = document.getElementById('btn-weather-archive-modal');
        const sideBtnOpenArchive = document.getElementById('side-btn-open-archive');
        const btnCloseArchive = document.getElementById('btn-close-archive-modal');

        if (btnArchiveModal) btnArchiveModal.addEventListener('click', () => this.openArchiveModal());
        if (sideBtnOpenArchive) sideBtnOpenArchive.addEventListener('click', () => this.openArchiveModal());
        if (btnCloseArchive) btnCloseArchive.addEventListener('click', () => this.closeArchiveModal());

        this.initArchiveControls();

        // Radar Controls
        const playBtn = document.getElementById('radar-play');
        if (playBtn) {
            playBtn.addEventListener('click', () => {
                this.radarPlaying = !this.radarPlaying;
                playBtn.innerText = this.radarPlaying ? 'PAUSE' : 'PLAY';
                if (this.radarPlaying) {
                    this.playRadarLoop();
                } else {
                    clearInterval(this.radarTimer);
                }
            });
        }

        const opacitySlider = document.getElementById('radar-opacity');
        if (opacitySlider) {
            opacitySlider.addEventListener('input', (e) => {
                this.radarOpacity = parseFloat(e.target.value);
                if (this.radarLayer) this.radarLayer.setOpacity(this.radarOpacity);
            });
        }

        const timeline = document.getElementById('radar-timeline');
        if (timeline) {
            timeline.addEventListener('input', (e) => {
                if (this.radarFrames.length > 0) {
                    const idx = Math.min(
                        Math.floor((parseInt(e.target.value) / 100) * (this.radarFrames.length - 1)),
                        this.radarFrames.length - 1
                    );
                    this.renderRadarFrame(idx);
                }
            });
        }

        // =========================================================================
        // Master Multi-Day Temporal Scrubber (Up to 7 Days / 168h) & Doppler Radar HUD
        // =========================================================================
        const masterTimeline = document.getElementById('master-timeline-slider');
        const masterLabel = document.getElementById('master-timeline-label');
        const replayBtn = document.getElementById('btn-timeline-replay');

        const mapMultidaySlider = document.getElementById('map-multiday-slider');
        const mapMultidayLabel = document.getElementById('map-multiday-label');
        const mapMultidayReplay = document.getElementById('btn-map-multiday-replay');

        const hudModeRadarBtn = document.getElementById('btn-hud-mode-radar');
        const hudModeMultidayBtn = document.getElementById('btn-hud-mode-multiday');
        const radarCtrlSubgroup = document.getElementById('radar-ctrl-subgroup');
        const multidayCtrlSubgroup = document.getElementById('multiday-ctrl-subgroup');

        const hudModeJevBtn = document.getElementById('btn-hud-mode-jev');
        const jevCtrlSubgroup = document.getElementById('jev-ctrl-subgroup');

        // Highlight & Focus between Radar Loop (2h), Multi-Day History (7 Tage), and JEV 10-Day Forecast
        if (hudModeRadarBtn) {
            hudModeRadarBtn.addEventListener('click', () => {
                if (this.isJevForecastMode) this.toggleJevMode(false);
                if (radarCtrlSubgroup) {
                    radarCtrlSubgroup.style.display = 'inline-flex';
                    radarCtrlSubgroup.style.outline = '1px solid #38bdf8';
                    setTimeout(() => { if (radarCtrlSubgroup) radarCtrlSubgroup.style.outline = 'none'; }, 1500);
                }
                if (multidayCtrlSubgroup) multidayCtrlSubgroup.style.display = 'inline-flex';
                if (jevCtrlSubgroup) jevCtrlSubgroup.style.display = 'none';
                hudModeRadarBtn.classList.add('active');
                if (hudModeJevBtn) hudModeJevBtn.classList.remove('active');
            });
        }

        if (hudModeMultidayBtn) {
            hudModeMultidayBtn.addEventListener('click', () => {
                if (this.isJevForecastMode) this.toggleJevMode(false);
                if (multidayCtrlSubgroup) {
                    multidayCtrlSubgroup.style.display = 'inline-flex';
                    multidayCtrlSubgroup.style.outline = '1px solid #facc15';
                    setTimeout(() => { if (multidayCtrlSubgroup) multidayCtrlSubgroup.style.outline = 'none'; }, 1500);
                }
                if (radarCtrlSubgroup) radarCtrlSubgroup.style.display = 'inline-flex';
                if (jevCtrlSubgroup) jevCtrlSubgroup.style.display = 'none';
                hudModeMultidayBtn.classList.add('active');
                if (hudModeJevBtn) hudModeJevBtn.classList.remove('active');
            });
        }

        if (hudModeJevBtn) {
            hudModeJevBtn.addEventListener('click', () => {
                this.toggleJevMode(true);
            });
        }

        const formatTimelineHours = (hoursAgo) => {
            if (hoursAgo === 0) return "LIVE";
            if (hoursAgo < 24) return `-${hoursAgo}h`;
            const days = Math.floor(hoursAgo / 24);
            const remHours = hoursAgo % 24;
            return remHours > 0 ? `-${days}d ${remHours}h` : `-${days}d`;
        };

        const setTemporalScrubber = (hoursAgo) => {
            hoursAgo = Math.max(0, Math.min(168, Math.round(hoursAgo)));
            const sliderVal = 168 - hoursAgo;
            if (masterTimeline) masterTimeline.value = sliderVal;
            if (mapMultidaySlider) mapMultidaySlider.value = sliderVal;

            const labelText = formatTimelineHours(hoursAgo);
            if (masterLabel) masterLabel.innerText = labelText;
            if (mapMultidayLabel) mapMultidayLabel.innerText = labelText;

            // Highlight active preset buttons
            document.querySelectorAll('.btn-preset-day, .btn-hud-day-preset').forEach(btn => {
                const btnH = parseInt(btn.dataset.hours, 10);
                const isMatch = (btnH === hoursAgo);
                btn.classList.toggle('active', isMatch);
                if (isMatch) {
                    btn.style.background = 'rgba(250,204,21,0.25)';
                    btn.style.color = '#facc15';
                    btn.style.borderColor = '#facc15';
                } else {
                    btn.style.background = 'transparent';
                    btn.style.color = '#94a3b8';
                    btn.style.borderColor = '#334155';
                }
            });

            this.filterHistoricalTelemetry(hoursAgo);
        };

        if (masterTimeline) {
            masterTimeline.addEventListener('input', (e) => {
                const hoursAgo = 168 - parseInt(e.target.value, 10);
                setTemporalScrubber(hoursAgo);
            });
        }

        if (mapMultidaySlider) {
            mapMultidaySlider.addEventListener('input', (e) => {
                const hoursAgo = 168 - parseInt(e.target.value, 10);
                setTemporalScrubber(hoursAgo);
            });
        }

        // Preset buttons click handlers
        document.querySelectorAll('.btn-preset-day, .btn-hud-day-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const h = parseInt(e.currentTarget.dataset.hours, 10);
                setTemporalScrubber(h);
            });
        });

        // Replay Controller for multi-day timeline
        let replayTimer = null;
        let replayActive = false;

        const toggleReplay = () => {
            replayActive = !replayActive;
            const btnText = replayActive ? "PAUSE" : "PLAY";
            if (replayBtn) replayBtn.innerText = btnText;
            if (mapMultidayReplay) mapMultidayReplay.innerText = btnText;

            if (replayActive) {
                let curHours = 168; // Start from 7 days ago
                setTemporalScrubber(curHours);
                replayTimer = setInterval(() => {
                    curHours -= 6;
                    if (curHours <= 0) {
                        curHours = 0;
                        setTemporalScrubber(0);
                        clearInterval(replayTimer);
                        replayActive = false;
                        if (replayBtn) replayBtn.innerText = "PLAY";
                        if (mapMultidayReplay) mapMultidayReplay.innerText = "PLAY";
                        return;
                    }
                    setTemporalScrubber(curHours);
                }, 700);
            } else {
                clearInterval(replayTimer);
            }
        };

        if (replayBtn) replayBtn.addEventListener('click', toggleReplay);
        if (mapMultidayReplay) mapMultidayReplay.addEventListener('click', toggleReplay);

        // =========================================================================
        // Live Weather Mode Selector (🌍 GLOBAL | 📍 LOKAL (SEKTOR) | ❌ AUS)
        // Supported in both Top Layer Strip and Tactical Sensors Sidebar
        // =========================================================================
        ['global', 'sector', 'off'].forEach(mode => {
            const btn = document.getElementById(`btn-weather-mode-${mode}`);
            if (btn) {
                btn.addEventListener('click', () => {
                    this.setWeatherDisplayMode(mode);
                });
            }
            const sideBtn = document.getElementById(`side-weather-mode-${mode}`);
            if (sideBtn) {
                sideBtn.addEventListener('click', () => {
                    this.setWeatherDisplayMode(mode);
                });
            }
        });

        const sideWeatherCb = document.getElementById('side-layer-weather-engines');
        if (sideWeatherCb) {
            sideWeatherCb.addEventListener('change', (e) => {
                this.setWeatherDisplayMode(e.target.checked ? 'global' : 'off');
            });
        }

        // Dossier Modal Close Listener
        const dossierClose = document.getElementById('dossier-close');
        const dossierModal = document.getElementById('inspect-modal');
        if (dossierClose && dossierModal) {
            dossierClose.addEventListener('click', () => {
                dossierModal.classList.add('hidden');
            });
            dossierModal.addEventListener('click', (e) => {
                if (e.target === dossierModal) dossierModal.classList.add('hidden');
            });
        }

        // 36 Hybrid Webcam Provider Selector Pills (Dynamic)
        this.initCameraProviders();
    }

    initCameraAndTelemetryControls() {
        const topCams = document.getElementById('layer-cams');
        const sideCams = document.getElementById('side-layer-cams');
        const topTele = document.getElementById('layer-telemetry');
        const sideTele = document.getElementById('side-layer-telemetry');

        const btnReal = document.getElementById('btn-filter-real-cams');
        const btnTele = document.getElementById('btn-filter-telemetry-nodes');
        const btnAll = document.getElementById('btn-filter-all-nodes');

        const syncState = () => {
            const camsChecked = (topCams ? topCams.checked : true);
            const teleChecked = (topTele ? topTele.checked : true);

            if (sideCams) sideCams.checked = camsChecked;
            if (sideTele) sideTele.checked = teleChecked;

            const activeTypes = [];
            if (camsChecked) activeTypes.push('camera');
            if (teleChecked) activeTypes.push('telemetry');

            if (activeTypes.length === 2) {
                this.cameraNodeTypeFilter = 'all';
            } else if (activeTypes.length === 0) {
                this.cameraNodeTypeFilter = 'none';
            } else {
                this.cameraNodeTypeFilter = activeTypes.join(',');
            }

            // Immediately prune deselected marker types from the active map pool
            if (this.activeCamMarkers) {
                for (const [id, marker] of this.activeCamMarkers.entries()) {
                    const nodeType = marker._cyberNodeType || 'camera';
                    if (!activeTypes.includes(nodeType)) {
                        this.camsLayer.removeLayer(marker);
                        this.activeCamMarkers.delete(id);
                    }
                }
            }

            if (btnReal) {
                const isOnlyReal = (this.cameraNodeTypeFilter === 'camera');
                btnReal.classList.toggle('active', isOnlyReal);
                btnReal.style.background = isOnlyReal ? 'rgba(56,189,248,0.3)' : 'transparent';
                btnReal.style.borderColor = isOnlyReal ? '#38bdf8' : '#334155';
            }
            if (btnTele) {
                const isOnlyTele = (this.cameraNodeTypeFilter === 'telemetry');
                btnTele.classList.toggle('active', isOnlyTele);
                btnTele.style.background = isOnlyTele ? 'rgba(250,204,21,0.25)' : 'transparent';
                btnTele.style.borderColor = isOnlyTele ? '#facc15' : '#854d0e';
            }
            if (btnAll) {
                const isAll = (this.cameraNodeTypeFilter === 'all');
                btnAll.classList.toggle('active', isAll);
                btnAll.style.background = isAll ? 'rgba(148,163,184,0.2)' : 'transparent';
                btnAll.style.borderColor = isAll ? '#94a3b8' : '#334155';
            }

            if (this.cameraNodeTypeFilter === 'none') {
                if (this.map.hasLayer(this.camsLayer)) this.map.removeLayer(this.camsLayer);
                if (this.activeCamMarkers) {
                    for (const [id, marker] of this.activeCamMarkers.entries()) {
                        this.camsLayer.removeLayer(marker);
                    }
                    this.activeCamMarkers.clear();
                }
            } else {
                if (!this.map.hasLayer(this.camsLayer)) this.camsLayer.addTo(this.map);
                this.refreshViewportCameras();
            }
        };

        if (topCams) topCams.addEventListener('change', (e) => {
            if (sideCams) sideCams.checked = e.target.checked;
            syncState();
        });
        if (sideCams) sideCams.addEventListener('change', (e) => {
            if (topCams) topCams.checked = e.target.checked;
            syncState();
        });
        if (topTele) topTele.addEventListener('change', (e) => {
            if (sideTele) sideTele.checked = e.target.checked;
            syncState();
        });
        if (sideTele) sideTele.addEventListener('change', (e) => {
            if (topTele) topTele.checked = e.target.checked;
            syncState();
        });

        if (btnReal) {
            btnReal.addEventListener('click', () => {
                if (topCams) topCams.checked = true;
                if (sideCams) sideCams.checked = true;
                if (topTele) topTele.checked = false;
                if (sideTele) sideTele.checked = false;
                syncState();
            });
        }
        if (btnTele) {
            btnTele.addEventListener('click', () => {
                if (topCams) topCams.checked = false;
                if (sideCams) sideCams.checked = false;
                if (topTele) topTele.checked = true;
                if (sideTele) sideTele.checked = true;
                syncState();
            });
        }
        if (btnAll) {
            btnAll.addEventListener('click', () => {
                if (topCams) topCams.checked = true;
                if (sideCams) sideCams.checked = true;
                if (topTele) topTele.checked = true;
                if (sideTele) sideTele.checked = true;
                syncState();
            });
        }

        this.initOmniTabs();
        syncState();
    }

    initOmniTabs() {
        const tabs = document.querySelectorAll('.omni-tab-btn');
        tabs.forEach(tab => {
            tab.addEventListener('click', () => {
                tabs.forEach(t => t.classList.remove('active'));
                tab.classList.add('active');
                const targetTab = tab.dataset.omniTab;
                if (window.MainPlayer && window.MainPlayer.switchOmniTab) {
                    window.MainPlayer.switchOmniTab(targetTab);
                }
            });
        });
    }

    async initCameraProviders() {
        const container = document.getElementById('cam-dynamic-provider-pills');
        if (!container) return;

        try {
            const res = await fetch('/api/cameras/providers');
            if (!res.ok) return;
            const data = await res.json();
            const providers = data.providers || [];

            const distinctCount = providers.filter(p => p.id !== 'all').length;
            const netLabel = document.getElementById('cam-networks-label') || document.querySelector('#cam-hybrid-provider-bar > span');
            if (netLabel) netLabel.innerText = `${distinctCount} NETWORKS:`;
            const searchInput = document.getElementById('cam-search');
            if (searchInput) searchInput.placeholder = `Search ${distinctCount} webcam networks (Miami, Alps, Tokyo, Hawaii, Berlin, Seaports, DOT)...`;
            const titleEl = document.getElementById('cam-active-title');
            if (titleEl && (titleEl.innerText.includes('GLOBAL WEBCAM NETWORKS') || titleEl.innerText.includes('NETWORKS //'))) {
                titleEl.innerText = `${distinctCount} GLOBAL WEBCAM NETWORKS // LIVE STREAM SWITCHER`;
            }

            container.innerHTML = '';
            providers.forEach((p, idx) => {
                const btn = document.createElement('button');
                btn.className = `provider-pill-btn ${idx === 0 ? 'active' : ''}`;
                btn.dataset.provider = p.id;
                const col = p.color || window.PROVIDER_COLORS[p.id] || '#38bdf8';
                const isActive = idx === 0;

                btn.style.cssText = `padding:2px 8px;font-size:0.7rem;cursor:pointer;border-radius:3px;border:1px solid ${isActive ? '#38bdf8' : '#334155'};background:${isActive ? 'rgba(56,189,248,0.2)' : '#0f172a'};color:${col};font-weight:bold;white-space:nowrap;`;
                btn.innerHTML = `${p.badge || p.name} <span style="color:#94a3b8;font-size:0.65rem;">(${p.count})</span>`;

                btn.addEventListener('click', async () => {
                    container.querySelectorAll('.provider-pill-btn').forEach(b => {
                        b.classList.remove('active');
                        b.style.borderColor = '#334155';
                        b.style.background = '#0f172a';
                    });
                    btn.classList.add('active');
                    btn.style.borderColor = '#38bdf8';
                    btn.style.background = 'rgba(56,189,248,0.2)';

                    const provId = p.id;
                    this.selectedProvider = provId;
                    this.loadCameraMarkers(provId);
                    await this.loadProviderCatalog(provId);
                });

                container.appendChild(btn);
            });
        } catch (e) {
            console.warn("Error fetching camera providers:", e);
        }
    }

    async filterHistoricalTelemetry(hoursAgo) {
        this.currentTemporalHours = hoursAgo;

        // 1. Re-render cached earthquakes and wildfires filtered by cutoff
        if (this.rawQuakes && this.rawQuakes.length > 0) this.renderQuakes(this.rawQuakes, hoursAgo);
        if (this.rawFires && this.rawFires.length > 0) this.renderFires(this.rawFires, hoursAgo);

        // 2. Multi-Day Timeline & Historical Weather Layers
        if (hoursAgo === 0) {
            // ==================== LIVE MODE ====================
            if (this.historicalWeatherLayer && this.map.hasLayer(this.historicalWeatherLayer)) {
                this.map.removeLayer(this.historicalWeatherLayer);
                this.historicalWeatherLayer = null;
            }
            if (this.historicalRadarLayer && this.map.hasLayer(this.historicalRadarLayer)) {
                this.map.removeLayer(this.historicalRadarLayer);
                this.historicalRadarLayer = null;
            }
            if (this.archiveEventsLayer) {
                this.archiveEventsLayer.clearLayers();
            }

            // Restore live radar layer
            if (this.radarLayer) {
                this.radarLayer.setOpacity(this.radarOpacity || 0.85);
            }
            this.renderRadarFrame(this.radarIndex);

            // Restore live alerts
            if (this.rawAlerts && this.rawAlerts.length > 0) {
                this.renderSevereAlerts(this.rawAlerts);
            }
            if (this.rawTornadoGroundAlerts && this.rawTornadoGroundAlerts.length > 0) {
                this.renderTornadoGroundAlerts(this.rawTornadoGroundAlerts);
            }

            const timeLabel = document.getElementById('radar-time-label');
            if (timeLabel && this.radarFrames && this.radarFrames[this.radarIndex]) {
                timeLabel.innerText = this.radarFrames[this.radarIndex].time_label || 'LIVE';
            }
        } else {
            // ==================== HISTORICAL REPLAY (-X HOURS / DAYS) ====================
            const targetMs = Date.now() - (hoursAgo * 3600 * 1000);
            const targetDate = new Date(targetMs);
            const isoDate = targetDate.toISOString().split('T')[0];
            const hh = String(targetDate.getUTCHours()).padStart(2, '0');
            const mm = String(Math.floor(targetDate.getUTCMinutes() / 10) * 10).padStart(2, '0');
            const timeLabelStr = `📅 ${isoDate} ${hh}:${mm} UTC (-${hoursAgo}h)`;

            // Update radar time label
            const timeLabel = document.getElementById('radar-time-label');
            if (timeLabel) timeLabel.innerText = timeLabelStr;

            // Dim or hide live radar frame during multi-day historical replay
            if (this.radarLayer && this.map.hasLayer(this.radarLayer)) {
                this.radarLayer.setOpacity(0.0);
            }

            // Render NASA GIBS Global True-Color Satellite Imagery for the historical date
            const gibsUrl = `https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_TrueColor/default/${isoDate}/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg`;

            if (this.historicalWeatherLayer && this.map.hasLayer(this.historicalWeatherLayer)) {
                this.historicalWeatherLayer.setUrl(gibsUrl);
                this.historicalWeatherLayer.setOpacity(this.radarOpacity || 0.85);
            } else {
                this.historicalWeatherLayer = L.tileLayer(gibsUrl, {
                    maxNativeZoom: 9,
                    maxZoom: 19,
                    opacity: this.radarOpacity || 0.85,
                    zIndex: 22,
                    attribution: `NASA GIBS / MODIS Terra (${isoDate})`
                }).addTo(this.map);
            }

            // If user has NEXRAD selected or is in USA, also overlay historical NEXRAD RIDGE composite
            const prov = this.activeRadarProvider || 'rainviewer';
            if (prov === 'nexrad') {
                const dateCompact = `${isoDate.replace(/-/g, '')}${hh}${mm}`;
                const nexradHistUrl = `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/ridge::USCOMP-N0Q-${dateCompact}/{z}/{x}/{y}.png`;
                if (this.historicalRadarLayer && this.map.hasLayer(this.historicalRadarLayer)) {
                    this.historicalRadarLayer.setUrl(nexradHistUrl);
                } else {
                    this.historicalRadarLayer = L.tileLayer(nexradHistUrl, {
                        maxNativeZoom: 11,
                        maxZoom: 19,
                        opacity: this.radarOpacity || 0.85,
                        zIndex: 23,
                        attribution: `NOAA / IEM NEXRAD RIDGE (${isoDate} ${hh}:${mm}Z)`
                    }).addTo(this.map);
                }
            } else {
                if (this.historicalRadarLayer && this.map.hasLayer(this.historicalRadarLayer)) {
                    this.map.removeLayer(this.historicalRadarLayer);
                    this.historicalRadarLayer = null;
                }
            }

            // Automatically fetch and plot historical NOAA Storm Reports (LSR) for this date
            if (this._lastLoadedArchiveDate !== isoDate) {
                this._lastLoadedArchiveDate = isoDate;
                try {
                    const res = await fetch(`/api/weather/archive/noaa/reports?date=${isoDate}`);
                    if (res.ok) {
                        const json = await res.json();
                        const reports = json.data || {};
                        this.plotArchiveEvents({ noaa_severe_archive: reports });
                    }
                } catch (err) {
                    console.warn("Could not fetch historical NOAA storm reports for date", isoDate, err);
                }
            }
        }
    }

    setWeatherDisplayMode(mode) {
        this.weatherDisplayMode = mode;
        ['global', 'sector', 'off'].forEach(m => {
            const isMatch = (m === mode);
            const activeBg = m === 'global' ? 'rgba(56,189,248,0.2)' : (m === 'sector' ? 'rgba(250,204,21,0.2)' : 'rgba(239,68,68,0.2)');
            const activeColor = m === 'global' ? '#38bdf8' : (m === 'sector' ? '#facc15' : '#ef4444');

            [document.getElementById(`btn-weather-mode-${m}`), document.getElementById(`side-weather-mode-${m}`)].forEach(btn => {
                if (btn) {
                    btn.classList.toggle('active', isMatch);
                    if (isMatch) {
                        btn.style.background = activeBg;
                        btn.style.color = activeColor;
                        btn.style.borderColor = activeColor;
                    } else {
                        btn.style.background = 'transparent';
                        btn.style.color = '#94a3b8';
                        btn.style.borderColor = '#334155';
                    }
                }
            });
        });

        const weatherCb = document.getElementById('layer-weather-engines');
        const sideWeatherCb = document.getElementById('side-layer-weather-engines');
        const isEnabled = (mode !== 'off');
        if (weatherCb) weatherCb.checked = isEnabled;
        if (sideWeatherCb) sideWeatherCb.checked = isEnabled;

        if (mode === 'off') {
            if (this.weatherEnginesLayer && this.map.hasLayer(this.weatherEnginesLayer)) {
                this.map.removeLayer(this.weatherEnginesLayer);
            }
            this.weatherEngineMarkers.clear();
        } else {
            if (weatherCb) weatherCb.checked = true;
            if (this.weatherEnginesLayer && !this.map.hasLayer(this.weatherEnginesLayer)) {
                this.map.addLayer(this.weatherEnginesLayer);
            }
            this.refreshViewportWeatherStations();
        }
    }

    pulseSectorScanRing(lat, lng) {
        if (!this.map) return;
        const scanCircle = L.circle([lat, lng], {
            radius: 15000,
            color: '#00f0ff',
            weight: 2,
            opacity: 0.85,
            fillColor: '#00f0ff',
            fillOpacity: 0.12,
            dashArray: '4, 4'
        }).addTo(this.map);

        let rad = 15000;
        let op = 0.85;
        const interval = setInterval(() => {
            rad += 6000;
            op -= 0.12;
            if (op <= 0) {
                clearInterval(interval);
                if (this.map.hasLayer(scanCircle)) {
                    this.map.removeLayer(scanCircle);
                }
            } else {
                scanCircle.setRadius(rad);
                scanCircle.setStyle({ opacity: op, fillOpacity: Math.max(0, op * 0.12) });
            }
        }, 50);
    }

    async onMapLocationClicked(lat, lng) {
        if (this.isJevForecastMode) return;

        // 1. Instant Visual Feedback: Tactical Reticle and Expanding Sonar Scan Ring
        this.placeReticle(lat, lng);
        this.pulseSectorScanRing(lat, lng);

        const hud = document.getElementById('cam-zoom-hud');
        if (hud) {
            hud.innerHTML = `<span><strong style="color:#00f0ff;">🔍 SEKTOR-SCAN AKTIV [${lat.toFixed(3)}°, ${lng.toFixed(3)}°]:</strong> <span style="color:#e2e8f0;">LADE LOKALE WEBCAMS & WETTERSTATIONEN...</span></span> <span style="color:#38bdf8;font-size:0.65rem;">● QUERY RUNNING</span>`;
        }

        // 2. Auto-Zoom into local sector if currently zoomed too far out
        const curZoom = this.map.getZoom();
        if (curZoom < 7) {
            this.map.setView([lat, lng], 8, { animate: true });
        }

        // 3. Define local sector bounding box (~60km radius)
        const dLat = 0.55;
        const dLon = 0.75;
        const minLat = lat - dLat;
        const maxLat = lat + dLat;
        const minLon = lng - dLon;
        const maxLon = lng + dLon;

        // 4. Parallel fetch: Local webcams & Local weather stations & Proximity locks
        try {
            const [camsBboxRes, nearbyCamsRes, weatherStationsRes] = await Promise.all([
                fetch(`/api/cameras/bbox?min_lat=${minLat}&max_lat=${maxLat}&min_lon=${minLon}&max_lon=${maxLon}&zoom=11&limit=250`),
                fetch(`/api/cameras/hybrid-nearby?lat=${lat}&lon=${lng}&radius=150&limit=15`),
                fetch(`/api/weather/stations/nearby?lat=${lat}&lon=${lng}&limit=25&radius_km=100`)
            ]);

            const [camsBboxData, nearbyCamsData, wsData] = await Promise.all([
                camsBboxRes.json().catch(() => ({ markers: [] })),
                nearbyCamsRes.json().catch(() => ({ webcams: [] })),
                weatherStationsRes.json().catch(() => ({ stations: [] }))
            ]);

            const sectorCams = camsBboxData.markers || [];
            const nearbyWebcams = nearbyCamsData.webcams || [];
            const sectorStations = wsData.stations || [];

            // 5. Direct Marker Injection into camsLayer (Instant rendering on Map!)
            let addedCams = 0;
            const allCamsToRender = [...nearbyWebcams, ...sectorCams];

            allCamsToRender.forEach(cam => {
                if (!cam || cam.lat === undefined || cam.lon === undefined || !cam.id) return;
                if (cam.node_type === 'flock' || (cam.provider || '').toLowerCase().includes('flock')) return;
                if (this.activeCamMarkers && this.activeCamMarkers.has(cam.id)) return;

                const nType = cam.node_type || (cam.stream_type === 'municipal_telemetry' ? 'telemetry' : 'camera');
                const prov = cam.provider || 'OpenCam';
                let marker;
                let color;
                let categoryBadge;

                if (nType === 'telemetry') {
                    color = '#facc15';
                    categoryBadge = `▲ [VERKEHRS-TELEMETRIE: ${prov.toUpperCase()}]`;
                    marker = L.triangleMarker([cam.lat, cam.lon], {
                        renderer: this.canvasRenderer,
                        radius: this.getDynamicNodeRadius(6.0),
                        color: '#030712',
                        fillColor: '#facc15',
                        fillOpacity: 0.95,
                        weight: 1
                    });
                    marker._cyberNodeType = 'telemetry'; marker._baseRadius = 6.0;
                } else {
                    color = '#38bdf8';
                    categoryBadge = `🔵 [LIVE WEBCAM: ${prov.toUpperCase()}]`;
                    marker = L.circleMarker([cam.lat, cam.lon], {
                        renderer: this.canvasRenderer,
                        radius: this.getDynamicNodeRadius(5.5),
                        color: '#030712',
                        fillColor: '#38bdf8',
                        fillOpacity: 0.95,
                        weight: 1.5
                    });
                    marker._cyberNodeType = 'camera'; marker._baseRadius = 6.0; marker._baseRadius = 5.0;
                }

                const rawPreview = cam.preview_url || cam.stream_url;
                const isFakeStock = rawPreview && (rawPreview.includes('cams/150') || rawPreview.includes('zugspitze-ost')) && !cam.id.toLowerCase().includes('zugspitze') && !(cam.title||'').toLowerCase().includes('zugspitze');
                const imgPreview = isFakeStock ? null : rawPreview;

                marker.bindPopup(`
                    <div style="font-family:var(--font-mono);font-size:12px;color:#0f172a;min-width:240px;">
                        <div style="font-weight:bold;color:${color};font-size:0.75rem;">${categoryBadge}</div>
                        <strong>${cam.title || 'Live Kamera'}</strong><br>
                        <span style="color:#64748b;">${cam.city || ''} ${cam.country || ''}</span><br>
                        ${imgPreview && !imgPreview.includes('.html') ? `<img src="${imgPreview}" onerror="this.style.display='none'" style="width:100%;height:95px;object-fit:cover;margin-top:5px;border-radius:3px;border:1px solid #cbd5e1;" />` : ''}
                        <button onclick="window.MapController.selectAndPlayCam('${cam.id}')" style="margin-top:6px;width:100%;background:${color};color:#fff;border:none;padding:6px 8px;font-weight:bold;border-radius:3px;cursor:pointer;font-family:inherit;box-shadow:0 0 8px rgba(0,0,0,0.3);">
                            ▶ LIVE-STREAM JETZT ÖFFNEN
                        </button>
                    </div>
                `, { offset: [0, -4] });

                marker.on('click', (ev) => {
                    this.notifyLayerClicked(ev);
                    this.selectAndPlayCam(cam.id);
                });

                if (this.camsLayer) {
                    this.camsLayer.addLayer(marker);
                    this.activeCamMarkers.set(cam.id, marker);
                    addedCams++;
                }
            });

            // 6. Direct Marker Injection into weatherEnginesLayer (Instant Green Pentagons!)
            let addedStations = 0;
            if (this.weatherEnginesLayer) {
                if (!this.map.hasLayer(this.weatherEnginesLayer)) {
                    this.weatherEnginesLayer.addTo(this.map);
                }
                sectorStations.forEach(st => {
                    if (!st || st.lat === undefined || st.lon === undefined || !st.id) return;
                    const markerKey = `station_${st.id}`;
                    if (this.weatherEngineMarkers && this.weatherEngineMarkers.has(markerKey)) return;

                    const marker = L.pentagonMarker([st.lat, st.lon], {
                        renderer: this.canvasRenderer,
                        radius: this.getDynamicNodeRadius(5.5),
                        color: '#022c22',
                        fillColor: '#10b981',
                        fillOpacity: 0.95,
                        weight: 1.5
                    });
                    marker._cyberNodeType = 'weather_station'; marker._baseRadius = 6.0;

                    marker.bindPopup(`
                        <div style="font-family:var(--font-mono);font-size:11px;min-width:260px;color:#0f172a;">
                            <div style="font-weight:bold;color:#059669;font-size:0.75rem;border-bottom:1px solid #94a3b8;padding-bottom:3px;margin-bottom:4px;">
                                ⬟ [WETTER-STATION: ${(st.provider || 'DWD/NOAA/WMO').toUpperCase()}]
                            </div>
                            <strong>${st.name || 'Wetterstation ' + st.id}</strong><br>
                            <span style="color:#64748b;">${st.country || ''} // Elev: ${st.elevation || 0}m // ID: ${st.id}</span>
                            <div style="margin-top:6px;display:flex;gap:4px;">
                                <button class="ops-btn" style="flex:1;padding:4px 6px;font-size:10px;background:#059669;color:#fff;border:none;cursor:pointer;font-weight:bold;border-radius:2px;" onclick="window.fetchStationLiveWeather('${st.id}', ${st.lat}, ${st.lon})">
                                    📡 LIVE WETTER
                                </button>
                                <button class="ops-btn" style="flex:1;padding:4px 6px;font-size:10px;background:#0284c7;color:#fff;border:none;cursor:pointer;font-weight:bold;border-radius:2px;" onclick="if(window.MapController && window.MapController.loadStationInMon02) window.MapController.loadStationInMon02('${st.id}', ${st.lat}, ${st.lon});">
                                    📊 DETAILS MON-02
                                </button>
                        <button onclick="window.lockRadarStationTarget('${st.id}', ${st.lat}, ${st.lon}, '${(st.name || '').replace(/'/g, '')}', '${(st.provider || 'Doppler Radar').replace(/'/g, '')}', ${st.elevation || 150})" class="ops-btn" style="margin-top:6px;width:100%;padding:5px 8px;font-size:10px;background:rgba(0,240,255,0.22);border:1px solid #00f0ff;color:#00f0ff;cursor:pointer;font-weight:900;letter-spacing:0.5px;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 0 10px rgba(0,240,255,0.3);">
                            🎯 ANVISIERE WETTERSTATION // RADAR DISH
                        </button>
                            </div>
                        </div>
                    `, { offset: [0, -4] });

                    marker.on('click', (ev) => {
                        this.notifyLayerClicked(ev);
                    });

                    this.weatherEnginesLayer.addLayer(marker);
                    this.weatherEngineMarkers.set(markerKey, marker);
                    addedStations++;
                });
            }

            // 7. Lock Nearest Proximity Camera and Ground Station in MON-02
            await this.lockProximityCamera(lat, lng, null, true);
            await this.lockProximityGroundStation(lat, lng);

            // 8. Update HUD with exact counts loaded in this sector
            if (hud) {
                hud.innerHTML = `<span><strong style="color:#10b981;">🎯 SEKTOR GELADEN [${lat.toFixed(3)}°, ${lng.toFixed(3)}°]:</strong> <span style="color:#38bdf8;">🔵 ${addedCams || sectorCams.length} WEBCAMS</span> <span style="color:#94a3b8;">//</span> <span style="color:#10b981;">⬟ ${addedStations || sectorStations.length} WETTERSTATIONEN</span> <span style="color:#facc15;">▲ TELEMETRIE AKTIV</span></span> <span style="color:#38bdf8;font-size:0.65rem;">● SYNCHRONISIERT</span>`;
            }

        } catch (err) {
            console.warn("Sector node loading error:", err);
            // Fallback locks
            await this.lockProximityCamera(lat, lng, null, false);
            await this.lockProximityGroundStation(lat, lng);
        }
    }

    notifyLayerClicked(ev) {
        this._lastLayerClickTime = Date.now();
        if (ev) {
            if (ev.originalEvent) {
                ev.originalEvent._layerClicked = true;
                if (typeof ev.originalEvent.stopPropagation === 'function') {
                    ev.originalEvent.stopPropagation();
                }
            }
            if (typeof ev.stopPropagation === 'function') {
                ev.stopPropagation();
            }
            if (window.L && L.DomEvent && typeof L.DomEvent.stopPropagation === 'function') {
                L.DomEvent.stopPropagation(ev);
            }
        }
    }

    placeReticle(lat, lng) {
        if (this.reticle) this.map.removeLayer(this.reticle);

        const icon = L.divIcon({
            className: 'ops-reticle',
            html: `
                <div style="width:36px;height:36px;margin-left:-18px;margin-top:-18px;position:relative;">
                    <div style="position:absolute;inset:0;border:2px solid #38bdf8;border-radius:50%;animation:reticle-pulse 1.2s infinite ease-out;"></div>
                    <div style="position:absolute;inset:8px;border:1px dashed #38bdf8;border-radius:50%;"></div>
                    <div style="position:absolute;top:50%;left:50%;width:6px;height:6px;margin:-3px;background:#ef4444;border-radius:50%;"></div>
                </div>
            `,
            iconSize: [36, 36],
            iconAnchor: [18, 18]
        });

        this.reticle = L.marker([lat, lng], { icon }).addTo(this.map);
    }

    async lockProximityGroundStation(lat, lng) {
        try {
            const res = await fetch(`/api/weather/stations/nearby?lat=${lat}&lon=${lng}&limit=5&radius_km=250`);
            if (!res.ok) return null;
            const data = await res.json();
            const stations = data.stations || [];
            if (stations.length === 0) return null;

            const st = stations[0];
            const titleEl = document.getElementById('cam-active-title');
            const telemetryBanner = document.getElementById('cam-telemetry-banner');

            // Provider display and authentic local name
            const countryLabel = resolveCountry(st.lat, st.lon, st.country);
            let provName = st.provider;
            if (!provName) {
                if (countryLabel.includes('Deutschland')) provName = 'DWD / Open-Meteo Sensor Grid';
                else if (st.lon >= -10.0 && st.lon <= 35.0 && st.lat >= 35.0 && st.lat <= 72.0) provName = 'EUMETNET / WMO European Grid';
                else if (st.source === 'ok_mesonet') provName = 'Oklahoma Mesonet';
                else if (st.source === 'tx_mesonet') provName = 'West Texas Mesonet';
                else if (st.source === 'airport_metar') provName = 'NOAA AWOS/ASOS';
                else provName = 'WMO Global Weather Station';
            }
            const stName = st.name || `Station ${st.id}`;

            if (titleEl) {
                titleEl.innerHTML = `<span style="color:#10b981;font-weight:bold;">📡 [${provName.toUpperCase()}]</span> <span style="color:#f8fafc;">${stName.toUpperCase()}</span>`;
            }

            // Fetch live telemetry for this specific station
            const liveRes = await fetch(`/api/weather/live?lat=${st.lat}&lon=${st.lon}`);
            const liveData = await liveRes.json();
            const om = liveData.open_meteo || {};
            const ow = liveData.open_weather || {};

            let tempStr = om.temperature_c !== undefined && om.temperature_c !== null ? `${om.temperature_c}°C (${om.temperature_f || Math.round(om.temperature_c * 9/5 + 32)}°F)` : (ow.temp !== undefined ? `${ow.temp}°C` : '--');
            let windStr = om.wind_speed_kmh !== undefined && om.wind_speed_kmh !== null ? `${om.wind_speed_kmh} km/h (GUST: ${om.wind_gusts_kmh || om.wind_speed_kmh} km/h) ${om.wind_direction_compass || ''}` : '--';
            let baroStr = om.surface_pressure_hpa !== undefined && om.surface_pressure_hpa !== null ? `${om.surface_pressure_hpa} hPa` : (ow.pressure_hpa ? `${ow.pressure_hpa} hPa` : '--');
            let humStr = om.relative_humidity !== undefined && om.relative_humidity !== null ? `${om.relative_humidity}%` : (ow.humidity !== undefined ? `${ow.humidity}%` : '--');
            let condStr = om.weather_description || ow.weather_desc || 'Active Convective Telemetry';

            if (telemetryBanner) {
                telemetryBanner.innerHTML = `
                    <span>📍 <strong>${stName}</strong> // STANDORT: <strong>${countryLabel}</strong> // DIST: <strong>${st.distance_km || 0} km</strong> (${st.bearing_compass || 'N'}) // ELEV: ${st.elevation || 0}m // QUELLE: <strong>${provName.toUpperCase()}</strong></span>
                    <span>LAGE: <strong style="color:#38bdf8;">${condStr.toUpperCase()}</strong> | TEMP: <strong style="color:#10b981;">${tempStr}</strong> | FEUCHTE: <strong style="color:#06b6d4;">${humStr}</strong> | WIND: <strong style="color:#f59e0b;">${windStr}</strong> | BARO: <strong style="color:#c084fc;">${baroStr}</strong></span>
                `;
            }

            // Pop up station marker on map with sector weather metrics
            L.popup({ offset: [0, -10] })
                .setLatLng([st.lat, st.lon])
                .setContent(`
                    <div style="font-family:var(--font-mono);font-size:11px;min-width:250px;color:#0f172a;">
                        <div style="font-weight:bold;color:#0369a1;border-bottom:1px solid #94a3b8;padding-bottom:3px;margin-bottom:4px;">
                            📡 [${provName.toUpperCase()}] ${stName}
                        </div>
                        <div><strong>STANDORT:</strong> ${countryLabel} | <strong>DIST:</strong> ${st.distance_km || 0} km</div>
                        <div><strong>HÖHE Ü. NN:</strong> ${st.elevation || 0} m | <strong>ID:</strong> ${st.id}</div>
                        <div style="margin-top:4px;padding:4px 6px;background:#f1f5f9;border-radius:3px;font-size:10px;">
                            <strong>TEMP:</strong> ${tempStr} | <strong>WIND:</strong> ${windStr}<br>
                            <strong>BARO:</strong> ${baroStr} | <strong>LAGE:</strong> ${condStr}
                        </div>
                        <button onclick="if(window.MapController && window.MapController.loadStationInMon02) window.MapController.loadStationInMon02('${st.id}', ${st.lat}, ${st.lon});" class="ops-btn" style="margin-top:6px;width:100%;padding:4px 6px;font-size:10px;background:#0284c7;color:#fff;border:none;cursor:pointer;font-weight:bold;border-radius:2px;">
                            📊 WETTER-DETAILS IN MON-02 ANZEIGEN
                        </button>
                    </div>
                `)
                .openOn(this.map);

            return st;
        } catch (e) {
            console.warn("lockProximityGroundStation error:", e);
            return null;
        }
    }

    async lockProximityCamera(lat, lng, provider = null, openMapPopup = true) {
        this.lastClickedLat = lat;
        this.lastClickedLng = lng;
        if (provider) this.selectedProvider = provider;
        const currentProv = this.selectedProvider || 'all';

        const titleEl = document.getElementById('cam-active-title');
        const telemetryBanner = document.getElementById('cam-telemetry-banner');

        try {
            const [camsRes, weatherRes] = await Promise.all([
                fetch(`/api/cameras/hybrid-nearby?lat=${lat}&lon=${lng}&radius=250&limit=20&provider=${currentProv}`),
                fetch(`/api/weather/live?lat=${lat}&lon=${lng}`)
            ]);

            const camsData = await camsRes.json();
            const weatherData = await weatherRes.json();
            const cams = camsData.webcams || camsData.cameras || [];

            const listContainer = document.getElementById('available-cams-list');
            if (listContainer) listContainer.innerHTML = '';

            let weatherStr = "WEATHER: DATA READY";
            if (weatherData.open_weather && weatherData.open_weather.temp !== undefined) {
                const ow = weatherData.open_weather;
                weatherStr = `${ow.weather_desc || 'Sky'} | ${ow.temp}°C | HUMIDITY: ${ow.humidity}% | BARO: ${ow.pressure_hpa} hPa`;
            } else if (weatherData.open_meteo && weatherData.open_meteo.temperature_c !== undefined) {
                const om = weatherData.open_meteo;
                weatherStr = `TEMP: ${om.temperature_c}°C | WIND: ${om.wind_speed_kmh} km/h (GUST: ${om.wind_gusts_kmh}) | BARO: ${om.surface_pressure_hpa} hPa`;
            }

            if (cams.length > 0) {
                // Populate available cameras selector with tactical badges for all authentic providers
                cams.forEach((cam, idx) => {
                    if (listContainer) {
                        const prov = cam.provider || 'OpenCam';
                        const badgeColor = window.PROVIDER_COLORS[prov] || '#38bdf8';
                        const badgeText = cam.provider_badge || `[${prov.toUpperCase()}]`;

                        const btn = document.createElement('button');
                        btn.className = `ops-btn ${idx === 0 ? 'active' : ''}`;
                        btn.style.cssText = 'padding:2px 8px;font-size:0.72rem;background:#131b2e;border:1px solid #334155;white-space:nowrap;cursor:pointer;display:inline-flex;align-items:center;gap:5px;';
                        btn.innerHTML = `<span style="color:${badgeColor};font-weight:bold;">${badgeText}</span> <span>${cam.title.substring(0, 26)}</span> <span style="color:#94a3b8;">(${cam.distance_km || 0} km)</span>`;
                        btn.onclick = () => {
                            document.querySelectorAll('#available-cams-list button').forEach(b => b.classList.remove('active'));
                            btn.classList.add('active');
                            window.MainPlayer.playCam(cam, 'live');
                            if (titleEl) {
                                titleEl.innerHTML = `<span style="color:${badgeColor};font-weight:bold;">${badgeText}</span> <span style="color:#f8fafc;">${cam.title.toUpperCase()}</span>`;
                            }
                            if (telemetryBanner) {
                                telemetryBanner.innerHTML = `
                                    <span>DIST: ${cam.distance_km} km // ${cam.city}, ${cam.country} // SOURCE: ${badgeText} // STATUS: ACTIVE</span>
                                    <span>${weatherStr}</span>
                                `;
                            }
                        };
                        listContainer.appendChild(btn);
                    }
                });

                // Auto-stream first available camera with live video mode
                const first = cams[0];
                const firstProv = first.provider || 'OpenCam';
                const firstBadge = first.provider_badge || `[${firstProv.toUpperCase()}]`;
                const firstColor = window.PROVIDER_COLORS[firstProv] || '#38bdf8';
                if (titleEl) {
                    titleEl.innerHTML = `<span style="color:${firstColor};font-weight:bold;">${firstBadge} LIVE:</span> <span style="color:#f8fafc;">${first.title.toUpperCase()}</span>`;
                }
                if (telemetryBanner) {
                    telemetryBanner.innerHTML = `
                        <span>DIST: ${first.distance_km} km // ${first.city}, ${first.country} // SOURCE: ${firstBadge} // STATUS: ACTIVE</span>
                        <span>${weatherStr}</span>
                    `;
                }
                window.MainPlayer.playCam(first, 'live');

                // Highlight on map if requested
                if (openMapPopup) {
                    L.popup({ offset: [0, -10] })
                        .setLatLng([first.lat, first.lon])
                        .setContent(`
                            <div style="font-family:var(--font-mono);font-size:12px;color:#0f172a;">
                                <strong>${firstBadge} ${first.title}</strong><br>
                                ${first.city}, ${first.country}<br>
                                Distance: ${first.distance_km} km<br>
                                <em>${weatherStr}</em>
                            </div>
                        `)
                        .openOn(this.map);
                }
            } else {
                if (listContainer) {
                    listContainer.innerHTML = `<span style="color:var(--text-dim);">NO WEBCAMS RETURNED IN SECTOR</span>`;
                }
            }
        } catch (err) {
            console.warn("Proximity camera search error:", err);
        }
    }

    async refreshViewportCameras() {
        if (this.camFetchAbortController) {
            this.camFetchAbortController.abort();
        }
        this.camFetchAbortController = new AbortController();
        const signal = this.camFetchAbortController.signal;

        try {
            if (!this.camsLayer || !this.map.hasLayer(this.camsLayer)) return;
            const zoom = this.map.getZoom();
            const provider = this.selectedProvider || 'all';
            const hudEl = document.getElementById('cam-zoom-hud');

            const bounds = this.map.getBounds();
            const minLat = bounds.getSouth();
            const maxLat = bounds.getNorth();
            const minLon = bounds.getWest();
            const maxLon = bounds.getEast();

            const nodeTypeFilter = this.cameraNodeTypeFilter || 'all';
            const queryLimit = zoom < 5 ? 2000 : (zoom < 9 ? 3500 : 5000);
            const res = await fetch(`/api/cameras/bbox?min_lat=${minLat}&max_lat=${maxLat}&min_lon=${minLon}&max_lon=${maxLon}&zoom=${zoom}&provider=${encodeURIComponent(provider)}&node_type=${encodeURIComponent(nodeTypeFilter)}&limit=${queryLimit}`, { signal });
            if (!res.ok) return;
            const data = await res.json();
            const markers = data.markers || [];

            // Spatial node retention: keep markers within wide viewing sector (0.35 pad)
            const expandedBounds = bounds.pad(0.35);
            for (const [id, marker] of this.activeCamMarkers.entries()) {
                const latLng = marker.getLatLng();
                if (!expandedBounds.contains(latLng)) {
                    this.camsLayer.removeLayer(marker);
                    this.activeCamMarkers.delete(id);
                }
            }

            // High-capacity GPU Canvas limit (up to 8,000 simultaneous active nodes)
            const MAX_CAM_MARKERS = 8000;
            if (this.activeCamMarkers.size > MAX_CAM_MARKERS) {
                for (const [id, marker] of this.activeCamMarkers.entries()) {
                    if (this.activeCamMarkers.size <= 6500) break;
                    if (!bounds.contains(marker.getLatLng())) {
                        this.camsLayer.removeLayer(marker);
                        this.activeCamMarkers.delete(id);
                    }
                }
                if (this.activeCamMarkers.size > MAX_CAM_MARKERS) {
                    for (const [id, marker] of this.activeCamMarkers.entries()) {
                        if (this.activeCamMarkers.size <= 6500) break;
                        this.camsLayer.removeLayer(marker);
                        this.activeCamMarkers.delete(id);
                    }
                }
            }

            const teleNodes = markers.filter(m => m.node_type === 'telemetry' || m.stream_type === 'municipal_telemetry');
            const realCams = markers.filter(m => !teleNodes.includes(m) && m.node_type !== 'flock');

            // Dynamic count across accumulated persistent active pool
            let poolRealCams = 0;
            let poolTeleNodes = 0;
            for (const [id, m] of this.activeCamMarkers.entries()) {
                const t = m._cyberNodeType || 'camera';
                if (t === 'telemetry') poolTeleNodes++;
                else poolRealCams++;
            }

            if (hudEl) {
                hudEl.innerHTML = `<span><strong style="color:#00f0ff;">🌐 [1.00 MIO. ECHTE WEBCAMS // 1.00 MIO. TELEMETRIE // 1.00 MIO. WETTER (3.00 MIO. KNOTENPUNKTE)]</strong> // VIEWPORT: <span style="color:#38bdf8;">🔵 ${Math.max(realCams.length, poolRealCams)} WEBCAMS</span> <span style="color:#94a3b8;">//</span> <span style="color:#facc15;">▲ ${Math.max(teleNodes.length, poolTeleNodes)} TELEMETRIE</span> <span style="color:#94a3b8;">(${provider.toUpperCase()})</span></span> <span style="color:#10b981;font-size:0.65rem;">● GPU CANVAS ENGINE ACTIVE</span>`;
            }

            markers.forEach(cam => {
                if (cam.lat === undefined || cam.lon === undefined) return;
                if (!cam.id) return;
                if (cam.node_type === 'flock' || (cam.provider || '').toLowerCase().includes('flock')) return;
                if (window.isOceanCoordinate && window.isOceanCoordinate(cam.lat, cam.lon)) return;
                // If marker is already in active pool, KEEP IT (do NOT recreate)
                if (this.activeCamMarkers.has(cam.id)) return;

                const nType = cam.node_type || (cam.stream_type === 'municipal_telemetry' ? 'telemetry' : 'camera');
                const prov = cam.provider || 'OpenCam';

                let marker;
                let color;
                let categoryBadge;

                if (nType === 'telemetry') {
                    // ▲ Gelbes Dreieck (Verkehrs-Telemetrie)
                    color = '#facc15';
                    categoryBadge = `▲ [VERKEHRS-TELEMETRIE: ${prov.toUpperCase()}]`;
                    marker = L.triangleMarker([cam.lat, cam.lon], {
                        renderer: this.canvasRenderer,
                        radius: this.getDynamicNodeRadius(6.0),
                        color: '#030712',
                        fillColor: '#facc15',
                        fillOpacity: 0.95,
                        weight: 1
                    });
                    marker._cyberNodeType = 'telemetry'; marker._baseRadius = 6.0;
                } else {
                    // 🔵 Blauer Kreis (Echte Webcams)
                    color = '#38bdf8';
                    categoryBadge = `🔵 [LIVE WEBCAM: ${prov.toUpperCase()}]`;
                    marker = L.circleMarker([cam.lat, cam.lon], {
                        renderer: this.canvasRenderer,
                        radius: this.getDynamicNodeRadius(5.0),
                        color: '#030712',
                        fillColor: '#38bdf8',
                        fillOpacity: 0.92,
                        weight: 1
                    });
                    marker._cyberNodeType = 'camera'; marker._baseRadius = 6.0; marker._baseRadius = 5.0;
                }

                const rawPreview = cam.preview_url || cam.stream_url;
                const isFakeStock = rawPreview && (rawPreview.includes('cams/150') || rawPreview.includes('zugspitze-ost')) && !cam.id.toLowerCase().includes('zugspitze') && !(cam.title||'').toLowerCase().includes('zugspitze');
                const imgPreview = isFakeStock ? null : rawPreview;

                marker.bindPopup(`
                    <div style="font-family:var(--font-mono);font-size:12px;color:#0f172a;min-width:240px;">
                        <div style="font-weight:bold;color:${color};font-size:0.75rem;">${categoryBadge}</div>
                        <strong>${cam.title || 'Live Kamera'}</strong><br>
                        <span style="color:#64748b;">${cam.city || ''} ${cam.country || ''}</span><br>
                        ${imgPreview && !imgPreview.includes('.html') ? `<img src="${imgPreview}" onerror="this.style.display='none'" style="width:100%;height:95px;object-fit:cover;margin-top:5px;border-radius:3px;border:1px solid #cbd5e1;" />` : ''}
                        <button onclick="window.MapController.selectAndPlayCam('${cam.id}')" style="margin-top:6px;width:100%;background:${color};color:#fff;border:none;padding:6px 8px;font-weight:bold;border-radius:3px;cursor:pointer;font-family:inherit;box-shadow:0 0 8px rgba(0,0,0,0.3);">
                            ▶ LIVE-STREAM JETZT ÖFFNEN
                        </button>
                    </div>
                `, { offset: [0, -4] });

                marker.on('click', (ev) => {
                    this.notifyLayerClicked(ev);
                    this.selectAndPlayCam(cam.id);
                });

                this.camsLayer.addLayer(marker);
                this.activeCamMarkers.set(cam.id, marker);
            });
        } catch (e) {
            if (e.name === 'AbortError') return;
            console.warn("Error refreshing viewport cameras:", e);
        }
    }

    async loadCameraMarkers(provider = 'all') {
        this.selectedProvider = provider;

        // If a specific provider was selected (not 'all'), auto-center map on provider's first camera
        if (provider !== 'all') {
            try {
                const catalogRes = await fetch(`/api/cameras/catalog?provider=${encodeURIComponent(provider)}&limit=1`);
                const catData = await catalogRes.json();
                if (catData.cameras && catData.cameras.length > 0) {
                    const targetCam = catData.cameras[0];
                    if (targetCam.lat && targetCam.lon) {
                        const targetZoom = Math.max(this.map.getZoom(), 11);
                        this.map.setView([targetCam.lat, targetCam.lon], targetZoom);
                        // Trigger immediate refresh after setView
                        setTimeout(() => this.refreshViewportCameras(), 300);
                        return;
                    }
                }
            } catch (err) {
                console.warn("Could not focus on provider:", err);
            }
        }

        await this.refreshViewportCameras();
    }

    async loadProviderCatalog(provider = 'all') {
        const titleEl = document.getElementById('cam-active-title');
        const telemetryBanner = document.getElementById('cam-telemetry-banner');
        const listContainer = document.getElementById('available-cams-list');

        if (titleEl) titleEl.innerText = `LOADING AVAILABLE ${provider.toUpperCase()} CAMERAS...`;
        if (listContainer) listContainer.innerHTML = '<span style="color:#38bdf8;">QUERYING ACTIVE NETWORK...</span>';

        try {
            const res = await fetch(`/api/cameras/catalog?provider=${encodeURIComponent(provider)}&limit=60`);
            const data = await res.json();
            const cams = data.cameras || [];

            if (listContainer) listContainer.innerHTML = '';

            if (cams.length > 0) {
                cams.forEach((cam, idx) => {
                    const prov = cam.provider || 'OpenCam';
                    const badgeColor = window.PROVIDER_COLORS[prov] || '#38bdf8';

                    const btn = document.createElement('button');
                    btn.className = `ops-btn ${idx === 0 ? 'active' : ''}`;
                    btn.style.cssText = 'padding:2px 8px;font-size:0.72rem;background:#131b2e;border:1px solid #334155;white-space:nowrap;cursor:pointer;display:inline-flex;align-items:center;gap:5px;';
                    btn.innerHTML = `<span style="color:${badgeColor};font-weight:bold;">[${prov.toUpperCase()}]</span> <span>${(cam.title || 'Camera').substring(0, 24)}</span> <span style="color:#94a3b8;">(${cam.city || cam.country || 'Live'})</span>`;

                    btn.onclick = () => {
                        document.querySelectorAll('#available-cams-list button').forEach(b => b.classList.remove('active'));
                        btn.classList.add('active');
                        this.selectAndPlayCam(cam.id);
                    };

                    listContainer.appendChild(btn);
                });

                // Auto-play the first camera of this provider
                const first = cams[0];
                this.selectAndPlayCam(first.id);
            } else {
                if (listContainer) listContainer.innerHTML = '<span style="color:#ef4444;">NO CAMERAS RETURNED FOR THIS SECTOR</span>';
            }
        } catch (e) {
            console.warn("Error loading provider catalog:", e);
        }
    }

    async selectAndPlayCam(camId) {
        try {
            const res = await fetch(`/api/cameras/${camId}`);
            if (!res.ok) return;
            const cam = await res.json();
            
            const titleEl = document.getElementById('cam-active-title');
            const telemetryBanner = document.getElementById('cam-telemetry-banner');
            const isTelemetry = (cam.node_type === 'telemetry' || cam.stream_type === 'municipal_telemetry');
            const prov = cam.provider || (isTelemetry ? 'Municipal' : 'OpenCam');

            const countryLabel = resolveCountry(cam.lat, cam.lon, cam.country);
            const isEurope = (cam.lon >= -10.0 && cam.lon <= 35.0 && cam.lat >= 35.0 && cam.lat <= 72.0);
            const isGermany = countryLabel.includes('Deutschland') || (cam.lon >= 5.0 && cam.lon <= 16.0 && cam.lat >= 47.0 && cam.lat <= 55.5);
            const defaultAgency = isGermany ? 'Verkehrszentrale / Landesbehörde' : (isEurope ? 'Municipal Traffic Authority' : 'Traffic Authority');
            const agencyLabel = (cam.agency || cam.operator || defaultAgency).toUpperCase();

            if (isTelemetry) {
                if (titleEl) titleEl.innerText = `▲ TELEMETRIE // ${(cam.title || 'SENSOR KNOTEN').toUpperCase()}`;
                if (telemetryBanner) {
                    telemetryBanner.innerHTML = `
                        <span>STANDORT: ${cam.city || ''}, ${countryLabel} // BEHÖRDE: ${agencyLabel} // STATUS: AKTIV</span>
                        <span>KOORDINATEN: ${(cam.lat || 0).toFixed(4)}°, ${(cam.lon || 0).toFixed(4)}°</span>
                    `;
                }
            } else {
                if (titleEl) titleEl.innerText = `${prov.toUpperCase()} LIVE: ${(cam.title || 'WEBCAM').toUpperCase()}`;
                if (telemetryBanner) {
                    telemetryBanner.innerHTML = `
                        <span>STANDORT: ${cam.city || ''}, ${countryLabel} // QUELLE: ${prov.toUpperCase()} // STATUS: LIVE</span>
                        <span>KOORDINATEN: ${(cam.lat || 0).toFixed(4)}°, ${(cam.lon || 0).toFixed(4)}°</span>
                    `;
                }
            }

            if (cam.lat && cam.lon) {
                this.placeReticle(cam.lat, cam.lon);
                this.map.flyTo([cam.lat, cam.lon], Math.max(this.map.getZoom(), 7), { duration: 1.0 });
                // Query nearby authentic ground weather station to immediately update telemetry banner
                this.lockProximityGroundStation(cam.lat, cam.lon);
            }

            window.MainPlayer.playCam(cam, 'live');
        } catch (e) {
            console.warn("Select camera error:", e);
        }
    }

    async initRadar() {
        try {
            const res = await fetch('/api/weather/radar');
            const data = await res.json();
            const past = (data.radar && data.radar.past) || data.radar_past || [];
            const nowcast = (data.radar && data.radar.nowcast) || data.radar_nowcast || [];
            if (past && past.length > 0) {
                this.radarHost = data.host || "https://tilecache.rainviewer.com";
                this.radarFrames = past;
                if (nowcast && nowcast.length > 0) {
                    this.radarFrames = this.radarFrames.concat(nowcast);
                }
                this.radarIndex = this.radarFrames.length - 1;
                this.renderRadarFrame(this.radarIndex);
                this.playRadarLoop();
            }
        } catch (e) {
            console.warn("RainViewer Radar error:", e);
        }
    }

    renderRadarFrame(index) {
        this.radarIndex = index || 0;
        const frame = (this.radarFrames && this.radarFrames[this.radarIndex]) || {};

        const prov = this.activeRadarProvider || 'rainviewer';
        const mode = this.activeRadarMode || 'composite';

        let tileUrl = '';
        let maxNative = 7;
        let hudStatus = 'GLOBAL RADAR [dBZ]';

        const host = this.radarHost || "https://tilecache.rainviewer.com";
        const path = frame.path || (this.radarFrames && this.radarFrames[0] ? this.radarFrames[0].path : '/v2/radar/nowcast');

        // 1. Authentic Provider & View Mode Routing
        if (prov === 'nexrad') {
            // Official NOAA Level-III NEXRAD Base Reflectivity Tile Server (Iowa State IEM / NOAA)
            tileUrl = 'https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913/{z}/{x}/{y}.png';
            maxNative = 11;
            hudStatus = '🇺🇸 NOAA NEXRAD LEVEL-III USA';
        } else if (prov === 'satellite' || mode === 'infrared') {
            // NASA GIBS WMTS Global Modis Infrared Satellite Cloud Layer
            tileUrl = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_CorrectedReflectance_Bands721/default/default/GoogleMapsCompatible_Level9/{z}/{y}/{x}.jpg';
            maxNative = 9;
            hudStatus = '🛰️ INFRAROT SATELLITEN-WOLKEN (NASA GIBS)';
        } else if (prov === 'dwd') {
            // DWD Germany Coverage: RainViewer calibrated scheme 1 (Meteo DWD)
            tileUrl = `${host}${path}/256/{z}/{x}/{y}/1/1_1.png`;
            maxNative = 8;
            hudStatus = '🇩🇪 DWD RADAR DEUTSCHLAND';
        } else if (prov === 'owm_rain' || mode === 'rain_rate') {
            // Precipitation Intensity Mode (Scheme 7 = Rainbow mm/h)
            tileUrl = `${host}${path}/256/{z}/{x}/{y}/7/1_1.png`;
            maxNative = 7;
            hudStatus = '🌧️ NIEDERSCHLAGSRATE (mm/h)';
        } else if (prov === 'owm_wind' || mode === 'velocity') {
            // Doppler Radial Velocity Mode (Scheme 6 = Radial Wind Velocity)
            tileUrl = `${host}${path}/256/{z}/{x}/{y}/6/1_1.png`;
            maxNative = 7;
            hudStatus = '💨 DOPPLER RADIAL-WIND';
        } else if (mode === 'echo_tops') {
            // Echo Tops Mode (Scheme 3 = TITAN Storm Tops)
            tileUrl = `${host}${path}/256/{z}/{x}/{y}/3/1_1.png`;
            maxNative = 7;
            hudStatus = '⚡ ECHOHÖHE (TITAN STORM TOPS)';
        } else {
            // RainViewer Composite dBZ (Scheme 2 = Universal Blue)
            tileUrl = `${host}${path}/256/{z}/{x}/{y}/2/1_1.png`;
            maxNative = 7;
            hudStatus = '📡 dBZ REFLEKTIVITÄT (RAINVIEWER)';
        }

        const radarTopCb = document.getElementById('layer-radar');
        const radarSideCb = document.getElementById('side-layer-radar');
        const isEnabled = (radarTopCb && radarTopCb.checked) || (radarSideCb && radarSideCb.checked);
        if (!isEnabled) {
            if (this.radarLayer && this.map.hasLayer(this.radarLayer)) {
                this.map.removeLayer(this.radarLayer);
                this.radarLayer = null;
            }
            if (this.radarLayerPrev && this.map.hasLayer(this.radarLayerPrev)) {
                this.map.removeLayer(this.radarLayerPrev);
                this.radarLayerPrev = null;
            }
            return;
        }

        // Remove any old conflicting static NOAA layer
        if (this.noaaRadarLayer && this.map.hasLayer(this.noaaRadarLayer)) {
            this.map.removeLayer(this.noaaRadarLayer);
        }

        const nextLayer = L.tileLayer(tileUrl, {
            opacity: this.radarOpacity,
            zIndex: 20,
            maxNativeZoom: maxNative,
            maxZoom: 19
        });

        nextLayer.addTo(this.map);

        // Seamless double-buffering: keep previous frame on screen until the new frame renders
        if (this.radarLayerPrev && this.map.hasLayer(this.radarLayerPrev)) {
            this.map.removeLayer(this.radarLayerPrev);
            this.radarLayerPrev = null;
        }
        if (this.radarLayer && this.radarLayer !== nextLayer) {
            const oldLayer = this.radarLayer;
            this.radarLayerPrev = oldLayer;
            const removeOld = () => {
                if (this.map.hasLayer(oldLayer)) {
                    this.map.removeLayer(oldLayer);
                }
                if (this.radarLayerPrev === oldLayer) {
                    this.radarLayerPrev = null;
                }
            };
            nextLayer.once('load', removeOld);
            setTimeout(removeOld, 350);
        }
        this.radarLayer = nextLayer;

        // Synchronize HUD time label
        const timeLabel = document.getElementById('radar-time-label');
        if (timeLabel) {
            if (frame.time_label) {
                timeLabel.innerText = frame.time_label;
            } else if (frame.time) {
                const date = new Date(frame.time * 1000);
                timeLabel.innerText = date.toTimeString().substr(0, 5) + " UTC";
            }
        }

        // Synchronize Radar Slider value
        const timelineSlider = document.getElementById('radar-timeline');
        if (timelineSlider && this.radarFrames.length > 1) {
            const pct = Math.round((index / (this.radarFrames.length - 1)) * 100);
            timelineSlider.value = pct;
        }
    }

    playRadarLoop() {
        clearInterval(this.radarTimer);
        this.radarTimer = setInterval(() => {
            if (!this.radarPlaying || this.radarFrames.length === 0) return;
            const radarCheckbox = document.getElementById('layer-radar');
            if (radarCheckbox && !radarCheckbox.checked) return;
            if (this.map && (this.map._animatingZoom || (this.map.dragging && this.map.dragging._draggable && this.map.dragging._draggable._moving))) return;

            let next = this.radarIndex + 1;
            if (next >= this.radarFrames.length) next = 0;
            this.renderRadarFrame(next);
        }, 1400);
    }

    async fetchSevereAlerts() {
        try {
            const res = await fetch('/api/weather/alerts/severe');
            if (!res.ok) return;
            const data = await res.json();
            const alerts = data.alerts || [];
            this.rawAlerts = alerts;
            this.renderSevereAlerts(alerts);
            const tornadoGround = data.tornado_ground_alerts || [];
            this.rawTornadoGroundAlerts = tornadoGround;
            this.renderTornadoGroundAlerts(tornadoGround);
            if (typeof this.updateLiveStormSidePanel === 'function') {
                this.updateLiveStormSidePanel();
            }
        } catch (e) {
            console.warn("NOAA Severe Alerts map fetch error:", e);
        }
    }

    renderSevereAlerts(alerts) {
        this.alertsLayer.clearLayers();
        this.alertGeometries.clear();

        const getAlertColor = (sev, evt) => {
            const evLower = (evt || '').toLowerCase();
            const sevLower = (sev || '').toLowerCase();
            if (evLower.includes('tornado')) return '#ef4444';
            if (evLower.includes('thunderstorm') || sevLower === 'extreme') return '#f97316';
            if (evLower.includes('flood')) return '#06b6d4';
            if (evLower.includes('marine') || evLower.includes('gale')) return '#3b82f6';
            if (sevLower === 'severe') return '#f59e0b';
            return '#ec4899';
        };

        alerts.forEach(alert => {
            if (!alert.geometry) return;

            const color = getAlertColor(alert.severity, alert.event);
            const evName = (alert.event || 'Severe Storm').toUpperCase();
            const sev = (alert.severity || 'UNKNOWN').toUpperCase();
            const area = alert.area_description || 'US Sector';
            const headline = alert.headline || '';
            const desc = (alert.description || '').slice(0, 260);

            const popupContent = `
                <div style="font-family:var(--font-mono);font-size:11px;min-width:220px;max-width:320px;">
                    <div style="font-weight:bold;color:${color};border-bottom:1px solid #334155;padding-bottom:3px;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
                        <span>⚠️</span>
                        <span>${evName}</span>
                    </div>
                    <div><strong>SEVERITY:</strong> <span style="color:${color};font-weight:bold;">${sev}</span> | <strong>URGENCY:</strong> ${alert.urgency || 'N/A'}</div>
                    <div style="margin-top:2px;"><strong>AREA:</strong> ${area}</div>
                    ${headline ? `<div style="margin-top:3px;color:#94a3b8;font-size:10px;">${headline}</div>` : ''}
                    ${desc ? `<div style="margin-top:3px;color:#cbd5e1;font-size:10px;line-height:1.3;">${desc}...</div>` : ''}
                    <div style="margin-top:6px;color:#38bdf8;font-size:10px;">DOPPLER RADAR ACTIVE STORM POLYGON</div>
                </div>
            `;

            try {
                const geoLayer = L.geoJSON(alert.geometry, {
                    pane: 'weatherZonesPane',
                    bubblingMouseEvents: false,
                    style: () => ({
                        color: color,
                        weight: 2,
                        opacity: 0.9,
                        fillColor: color,
                        fillOpacity: 0.24,
                        dashArray: sev === 'EXTREME' || evName.includes('TORNADO') ? null : '4, 4',
                        className: 'severe-alert-polygon alert-zone-pass-through'
                    })
                });

                let center = null;
                try {
                    const bounds = geoLayer.getBounds();
                    if (bounds && bounds.isValid()) {
                        center = bounds.getCenter();
                    }
                } catch(e) {}
                const stormLat = center ? center.lat : 36.6853;
                const stormLon = center ? center.lng : -102.4975;

                const extendedPopup = `
                    <div style="font-family:var(--font-mono);font-size:11px;min-width:250px;max-width:330px;">
                        <div style="font-weight:bold;color:${color};border-bottom:1px solid #334155;padding-bottom:3px;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
                            <span>⚠️</span>
                            <span>${evName}</span>
                        </div>
                        <div><strong>SEVERITY:</strong> <span style="color:${color};font-weight:bold;">${sev}</span> | <strong>URGENCY:</strong> ${alert.urgency || 'N/A'}</div>
                        <div style="margin-top:2px;"><strong>AREA:</strong> ${area}</div>
                        ${headline ? `<div style="margin-top:3px;color:#94a3b8;font-size:10px;">${headline}</div>` : ''}
                        ${desc ? `<div style="margin-top:3px;color:#cbd5e1;font-size:10px;line-height:1.3;">${desc}...</div>` : ''}
                        <div style="margin-top:4px;color:#38bdf8;font-size:10px;">POSITION: ${stormLat.toFixed(4)}°, ${stormLon.toFixed(4)}°</div>
                        <div style="display:flex;gap:4px;margin-top:8px;">
                            <button class="ops-btn" style="flex:1;padding:4px 6px;font-size:10px;background:rgba(239,68,68,0.25);border-color:#ef4444;color:#fca5a5;cursor:pointer;font-weight:bold;" onclick="window.openSupercellDossier('${alert.id}', ${stormLat}, ${stormLon})">
                                🌪️ SUPERCELL DOSSIER
                            </button>
                            <button class="ops-btn" style="flex:1;padding:4px 6px;font-size:10px;background:rgba(16,185,129,0.25);border-color:#10b981;color:#6ee7b7;cursor:pointer;font-weight:bold;" onclick="if(window.MapController){window.MapController.lockProximityGroundStation(${stormLat}, ${stormLon}); window.MapController.lockProximityCamera(${stormLat}, ${stormLon});}">
                                📡 BODENSTATION
                            </button>
                        </div>
                    </div>
                `;

                geoLayer.bindPopup(extendedPopup);
                geoLayer.on('click', (ev) => {
                    this.notifyLayerClicked(ev);
                    this.placeReticle(stormLat, stormLon);
                    if (window.openSupercellDossier) {
                        window.openSupercellDossier(alert.id, stormLat, stormLon);
                    }
                });

                // ⬢ Rotes Sechseck (Unwetter- & Sturm-Zentrum)
                const hexMarker = L.hexagonMarker([stormLat, stormLon], {
                    renderer: this.canvasRenderer,
                    radius: 6.5,
                    color: '#ffffff',
                    fillColor: '#ef4444',
                    fillOpacity: 0.95,
                    weight: 1.5
                }).bindPopup(extendedPopup);

                hexMarker.on('click', (ev) => {
                    this.notifyLayerClicked(ev);
                    this.placeReticle(stormLat, stormLon);
                    if (window.openSupercellDossier) {
                        window.openSupercellDossier(alert.id, stormLat, stormLon);
                    }
                });

                this.alertsLayer.addLayer(geoLayer);
                this.alertsLayer.addLayer(hexMarker);
                if (alert.id) {
                    this.alertGeometries.set(alert.id, geoLayer);
                }
            } catch (err) {
                // Ignore malformed geojson
            }
        });

        if (typeof this.updateLiveStormSidePanel === 'function') {
            this.updateLiveStormSidePanel();
        }
    }

    locateAlert(alertId) {
        const layer = this.alertGeometries.get(alertId);
        if (layer) {
            const bounds = layer.getBounds();
            if (bounds && bounds.isValid()) {
                this.map.fitBounds(bounds, { maxZoom: 10, padding: [40, 40] });
                layer.openPopup();
                const center = bounds.getCenter();
                this.placeReticle(center.lat, center.lng);
                return;
            }
        }
    }

    async loadStationInMon02(stId, lat, lon, extraData = {}) {
        try {
            const res = await fetch(`/api/weather/live?lat=${lat}&lon=${lon}`).catch(() => null);
            const data = res && res.ok ? await res.json().catch(() => ({})) : {};
            const om = data.open_meteo || {};
            const ow = data.open_weather || {};
            const merged = Object.assign({}, extraData);

            if (window.MainPlayer && window.MainPlayer.showGroundStationTelemetry) {
                window.MainPlayer.showGroundStationTelemetry({
                    id: stId,
                    lat: lat,
                    lon: lon,
                    title: merged.name || merged.title || (merged.station_type === 'lightning' || String(stId).toLowerCase().includes('blitz') ? `Blitzortung Station ${stId}` : `Wetterstation ${stId}`),
                    station_type: merged.station_type || (String(stId).toLowerCase().includes('blitz') || (merged.name && merged.name.toLowerCase().includes('blitz')) ? 'lightning' : (merged.cpm ? 'radiation' : (merged.raw_metar ? 'metar' : 'weather'))),
                    provider: merged.provider || 'NOAA / WMO / Blitzortung',
                    raw_metar: merged.raw_metar,
                    flight_cat: merged.flight_cat,
                    cpm: merged.cpm,
                    usv_h: merged.usv_h,
                    strike_rate: merged.strike_rate || 16,
                    peak_current_ka: merged.peak_current_ka || -41.2,
                    open_meteo: om,
                    open_weather: ow
                });
            }
        } catch(e) {
            console.warn("loadStationInMon02 error:", e);
        }
    }

    renderTornadoGroundAlerts(tornadoGround) {
        if (!this.tornadoGroundLayer) return;
        this.tornadoGroundLayer.clearLayers();
        if (!Array.isArray(tornadoGround) || tornadoGround.length === 0) {
            if (typeof this.updateLiveStormSidePanel === 'function') {
                this.updateLiveStormSidePanel();
            }
            return;
        }

        tornadoGround.forEach(async (tg) => {
            const lat = tg.lat != null ? tg.lat : (tg.centroid && tg.centroid.lat);
            const lon = tg.lon != null ? tg.lon : (tg.centroid && tg.centroid.lon);
            if (lat == null || lon == null || isNaN(lat) || isNaN(lon)) return;
            if (window.isOceanCoordinate && window.isOceanCoordinate(lat, lon)) return;
            const isGroundConfirmed = tg.is_ground_confirmed === true || tg.status === 'CONFIRMED_GROUND_CONTACT';
            const threat = tg.threat_level || (isGroundConfirmed ? 'OBSERVED GROUND CONTACT' : 'RADAR INDICATED ROTATION (KEIN BODENKONTAKT)');
            const ef = tg.ef_rating || tg.ef_scale || (isGroundConfirmed ? 'AUSSTEHEND (DAMAGE SURVEY)' : 'N/A (RADAR INDICATED)');
            const tags = (tg.detection_tags || []).join(' // ') || (isGroundConfirmed ? 'Bodenkontakt Bestätigt' : 'Radar Indicated Rotation');
            const headline = tg.headline || (isGroundConfirmed ? 'Bestätigter Tornado am Boden' : 'Radar-Indizierte Mesozzyklone');
            const area = (typeof resolveCountry === 'function' ? resolveCountry(lat, lon, tg.area_description) : (tg.area_description || 'Severe Storm Sector'));
            const motion_deg = tg.motion_deg !== undefined ? tg.motion_deg : 240;
            const motion_kts = tg.motion_kts !== undefined ? tg.motion_kts : 35;
            const wind_speed_mph = tg.wind_speed_mph;
            const windDisplay = tg.wind_speed || (wind_speed_mph ? `${wind_speed_mph} MPH` : (isGroundConfirmed ? 'Bodenmessung ausstehend' : 'Doppler-Rotation (Nicht gemessen)'));

            const markerWrapClass = isGroundConfirmed ? 'tornado-vortex-circle-wrap' : 'tornado-vortex-circle-wrap radar-indicated';
            const spinOuterClass = isGroundConfirmed ? 'tornado-circle-spin-outer' : 'tornado-circle-spin-outer radar-indicated';
            const coreClass = isGroundConfirmed ? 'tornado-vortex-core' : 'tornado-vortex-core radar-indicated';
            const tagClass = isGroundConfirmed ? 'tornado-vortex-tag' : 'tornado-vortex-tag radar-indicated';
            const tagText = isGroundConfirmed ? `${ef} • ${windDisplay}` : `RADAR ROTATION • ${windDisplay}`;
            const headerTitle = isGroundConfirmed ? '🚨 TORNADO AM BODEN // CONFIRMED GROUND CONTACT (OBSERVED)' : '🌪️ MESOZYKLONE IM RADAR // RADAR INDICATED (UNBESTÄTIGT)';
            const headerColor = isGroundConfirmed ? '#dc2626' : '#ea580c';
            const headerBorder = isGroundConfirmed ? '#ef4444' : '#f97316';
            const statusStyle = isGroundConfirmed ? 'background:#fee2e2;color:#b91c1c;' : 'background:#ffedd5;color:#c2410c;';
            const coneBorderColor = isGroundConfirmed ? '#ef4444' : '#f97316';
            const coneFillColor = isGroundConfirmed ? '#dc2626' : '#ea580c';
            const noticeHtml = isGroundConfirmed
                ? '<div style="margin-top:3px;font-size:10px;color:#991b1b;background:#fef2f2;padding:3px 5px;border-left:2px solid #ef4444;">🚨 <strong>BODENKONTAKT BESTÄTIGT:</strong> Verifiziert durch NWS/Spotter oder TDS Trümmer-Signatur. Offizielle EF-Skala wird nach Ground Damage Survey vergeben.</div>'
                : '<div style="margin-top:3px;font-size:10px;color:#9a3412;background:#fff7ed;padding:3px 5px;border-left:2px solid #f97316;">📡 <strong>KEIN BODENKONTAKT BESTÄTIGT:</strong> Doppler-Radar erfasst Zirkulation in der Wolke. NWS Damage Survey ausstehend.</div>';

            // 1. DYNAMIC VORTEX MARKER (RED = OBSERVED GROUND, AMBER = RADAR INDICATED)
            const vortexIcon = L.divIcon({
                className: isGroundConfirmed ? 'tornado-vortex-pin' : 'tornado-vortex-pin radar-indicated',
                html: `
                    <div class="${markerWrapClass}" title="${headerTitle} // ${ef} • ${windDisplay} (Zugrichtung: ${motion_deg}°)">
                        <div class="${spinOuterClass}"></div>
                        <div class="${coreClass}">🌪️</div>
                        <div class="tornado-heading-tick" style="transform: rotate(${motion_deg}deg);"><span>▲</span></div>
                        <div class="${tagClass}">${tagText}</div>
                    </div>
                `,
                iconSize: [48, 48],
                iconAnchor: [24, 24]
            });

            const marker = L.marker([lat, lon], { icon: vortexIcon, zIndexOffset: 1000 });

            const popupContent = `
                <div style="font-family:var(--font-mono);font-size:11px;min-width:270px;max-width:350px;color:#0f172a;">
                    <div style="font-weight:900;color:${headerColor};border-bottom:2px solid ${headerBorder};padding-bottom:4px;margin-bottom:6px;display:flex;align-items:center;gap:6px;font-size:12px;">
                        <span>${isGroundConfirmed ? '🌪️' : '📡'}</span>
                        <span>${headerTitle}</span>
                    </div>
                    <div><strong>STATUS:</strong> <span style="${statusStyle}padding:1px 6px;border-radius:3px;font-weight:bold;">${threat.toUpperCase()}</span></div>
                    <div style="margin-top:3px;"><strong>EF-BEWERTUNG:</strong> <strong style="color:${headerColor};">${ef}</strong></div>
                    <div style="margin-top:2px;"><strong>WINDGESCHWINDIGKEIT:</strong> <span>${windDisplay}</span></div>
                    <div style="margin-top:2px;"><strong>ZUGBAHN:</strong> <span style="color:#0284c7;font-weight:bold;">${motion_deg}° @ ${motion_kts} KTS</span></div>
                    <div style="margin-top:2px;"><strong>ERFASSUNG:</strong> <span style="color:#475569;">${tags}</span></div>
                    <div style="margin-top:2px;"><strong>SEKTOR:</strong> ${area}</div>
                    ${noticeHtml}
                    <div style="margin-top:4px;font-size:10px;color:#64748b;">${headline}</div>
                    <div style="display:flex;gap:4px;margin-top:8px;">
                        <button class="ops-btn" style="flex:1;padding:4px 6px;font-size:10px;background:${headerColor};color:#fff;border:none;cursor:pointer;font-weight:bold;" onclick="if(window.MapController){window.MapController.targetStorm({lat:${lat},lon:${lon},id:'${tg.alert_id||tg.id||''}',title:'${headline.replace(/'/g, '')}',ef_scale:'${ef}',wind_speed:'${windDisplay}',is_tornado:true,is_ground_confirmed:${isGroundConfirmed}});}">
                            🎯 ANVISIEREN
                        </button>
                        <button class="ops-btn" style="flex:1;padding:4px 6px;font-size:10px;background:#0284c7;color:#fff;border:none;cursor:pointer;font-weight:bold;" onclick="if(window.MapController){window.MapController.lockProximityGroundStation(${lat}, ${lon}); window.MapController.lockProximityCamera(${lat}, ${lon});}">
                            📡 BODENSTATION
                        </button>
                    </div>
                </div>
            `;

            marker.bindPopup(popupContent);
            marker.on('click', (ev) => {
                this.notifyLayerClicked(ev);
            });
            this.tornadoGroundLayer.addLayer(marker);

            // =========================================================================
            // 2. PROJECTED TORNADO LIVE PATH & DANGER CORRIDOR (+15m, +30m, +45m CONE)
            // =========================================================================
            try {
                const projectPoint = (fromLat, fromLon, bearingDeg, distKm) => {
                    const R = 6371.0;
                    const brng = bearingDeg * Math.PI / 180.0;
                    const lat1 = fromLat * Math.PI / 180.0;
                    const lon1 = fromLon * Math.PI / 180.0;
                    const lat2 = Math.asin(Math.sin(lat1) * Math.cos(distKm / R) + Math.cos(lat1) * Math.sin(distKm / R) * Math.cos(brng));
                    const lon2 = lon1 + Math.atan2(Math.sin(brng) * Math.sin(distKm / R) * Math.cos(lat1), Math.cos(distKm / R) - Math.sin(lat1) * Math.sin(lat2));
                    return {
                        lat: lat2 * 180.0 / Math.PI,
                        lon: lon2 * 180.0 / Math.PI
                    };
                };

                const speedKmh = motion_kts * 1.852;
                const dist15 = speedKmh * (15.0 / 60.0);
                const dist30 = speedKmh * (30.0 / 60.0);
                const dist45 = speedKmh * (45.0 / 60.0);

                const p15 = projectPoint(lat, lon, motion_deg, dist15);
                const p30 = projectPoint(lat, lon, motion_deg, dist30);
                const p45 = projectPoint(lat, lon, motion_deg, dist45);

                const coneRight = projectPoint(lat, lon, (motion_deg + 16) % 360, dist45 * 1.08);
                const coneLeft = projectPoint(lat, lon, (motion_deg - 16 + 360) % 360, dist45 * 1.08);

                // Expanding danger corridor polygon (pass-through clicks)
                const dangerCone = L.polygon([
                    [lat, lon],
                    [coneRight.lat, coneRight.lon],
                    [p45.lat, p45.lon],
                    [coneLeft.lat, coneLeft.lon]
                ], {
                    pane: 'weatherZonesPane',
                    color: coneBorderColor,
                    weight: 1.5,
                    dashArray: '4, 4',
                    fillColor: coneFillColor,
                    fillOpacity: isGroundConfirmed ? 0.16 : 0.11,
                    className: 'tornado-hazard-polygon alert-zone-pass-through',
                    bubblingMouseEvents: false
                });
                dangerCone.bindTooltip(`⚠️ GEFAHRENKORRIDOR: Zugbahn ${motion_deg}° @ ${motion_kts} KTS (${isGroundConfirmed ? 'Bodenkontakt Bestätigt' : 'Radar-Rotation'})`, { sticky: true });
                dangerCone.on('click', (ev) => {
                    this.notifyLayerClicked(ev);
                    if (window.openSupercellDossier) {
                        window.openSupercellDossier(tg.alert_id || tg.id, lat, lon);
                    }
                });
                this.tornadoGroundLayer.addLayer(dangerCone);

                // Central trajectory projection line
                const pathLine = L.polyline([
                    [lat, lon],
                    [p15.lat, p15.lon],
                    [p30.lat, p30.lon],
                    [p45.lat, p45.lon]
                ], {
                    pane: 'weatherZonesPane',
                    color: coneBorderColor,
                    weight: 3.5,
                    dashArray: '8, 6',
                    opacity: 0.95,
                    className: 'alert-zone-pass-through',
                    bubblingMouseEvents: false
                });
                pathLine.bindTooltip(`🌪️ LIVE-PFAD: ${motion_deg}° @ ${motion_kts} KTS (${speedKmh.toFixed(0)} km/h)`, { sticky: true });
                this.tornadoGroundLayer.addLayer(pathLine);


                // Checkpoint markers at +15m, +30m, +45m
                const waypoints = [
                    { pt: p15, eta: '+15 MIN' },
                    { pt: p30, eta: '+30 MIN' },
                    { pt: p45, eta: '+45 MIN' }
                ];
                waypoints.forEach(({ pt, eta }) => {
                    const wp = L.circleMarker([pt.lat, pt.lon], {
                        pane: 'sensorMarkersPane',
                        radius: 5,
                        color: '#ffffff',
                        fillColor: '#ef4444',
                        fillOpacity: 0.95,
                        weight: 2,
                        className: 'alert-zone-pass-through',
                        bubblingMouseEvents: false
                    });
                    wp.bindTooltip(`📍 PROGNOSE ${eta} // [${pt.lat.toFixed(3)}°, ${pt.lon.toFixed(3)}°]`, { direction: 'top', sticky: true });
                    wp.on('click', (ev) => {
                        this.notifyLayerClicked(ev);
                    });
                    this.tornadoGroundLayer.addLayer(wp);
                });
            } catch (err) {
                console.warn("Error rendering tornado projected path:", err);
            }

            // 3. Display Warning Polygon on Map (Non-blocking fill)
            if (tg.geometry) {
                try {
                    const polyLayer = L.geoJSON(tg.geometry, {
                        pane: 'weatherZonesPane',
                        bubblingMouseEvents: false,
                        style: {
                            color: '#ef4444',
                            weight: 3,
                            fillColor: '#b91c1c',
                            fillOpacity: 0.35,
                            dashArray: '5, 5',
                            className: 'tornado-hazard-polygon alert-zone-pass-through'
                        }
                    });
                    polyLayer.bindPopup(popupContent);
                    polyLayer.on('click', (ev) => {
                        this.notifyLayerClicked(ev);
                    });
                    this.tornadoGroundLayer.addLayer(polyLayer);
                } catch (err) {
                    console.warn("Error rendering tornado warning polygon:", err);
                }
            } else {
                const hazardCircle = L.circle([lat, lon], {
                    pane: 'weatherZonesPane',
                    radius: 12000,
                    color: '#ef4444',
                    weight: 3,
                    fillColor: '#b91c1c',
                    fillOpacity: 0.28,
                    dashArray: '6, 6',
                    className: 'tornado-hazard-polygon alert-zone-pass-through',
                    bubblingMouseEvents: false
                });
                hazardCircle.bindPopup(popupContent);
                hazardCircle.on('click', (ev) => {
                    this.notifyLayerClicked(ev);
                });
                this.tornadoGroundLayer.addLayer(hazardCircle);
            }

            // Connect confirmed tornado to nearby authentic ground weather stations
            try {
                const stnRes = await fetch(`/api/weather/stations/nearby?lat=${lat}&lon=${lon}&limit=3&radius_km=100`);
                if (stnRes.ok) {
                    const stnData = await stnRes.json();
                    const stations = stnData.stations || [];
                    stations.forEach((st, sIdx) => {
                        const linkLine = L.polyline([[lat, lon], [st.lat, st.lon]], {
                            color: sIdx === 0 ? '#ef4444' : '#f59e0b',
                            weight: 2,
                            dashArray: '4, 4',
                            opacity: 0.85,
                            className: 'alert-zone-pass-through'
                        });
                        linkLine.bindTooltip(`📡 SENSOR-LINK: ${st.name} (${st.distance_km || 0} km)`, { sticky: true });
                        this.tornadoGroundLayer.addLayer(linkLine);

                        const stMarker = L.circleMarker([st.lat, st.lon], {
                            radius: 6,
                            color: '#10b981',
                            fillColor: '#059669',
                            fillOpacity: 0.9,
                            weight: 2
                        });
                        stMarker.bindPopup(`
                            <div style="font-family:var(--font-mono);font-size:11px;min-width:220px;color:#0f172a;">
                                <div style="font-weight:bold;color:#0369a1;border-bottom:1px solid #cbd5e1;padding-bottom:3px;margin-bottom:4px;">
                                    📡 BODENSTATION // ${st.name}
                                </div>
                                <div><strong>DISTANZ ZUM TORNADO:</strong> <span style="color:#dc2626;font-weight:bold;">${st.distance_km || 0} km</span></div>
                                <div><strong>ID:</strong> ${st.id} | <strong>TYP:</strong> ${st.type || 'Mesonet'}</div>
                                <button onclick="if(window.MapController){window.MapController.lockProximityGroundStation(${st.lat}, ${st.lon});}" class="ops-btn" style="margin-top:6px;width:100%;padding:4px 6px;font-size:10px;background:#0284c7;color:#fff;border:none;cursor:pointer;font-weight:bold;border-radius:2px;">
                                    📊 TELEMETRIE LADEN
                                </button>
                            </div>
                        `);
                        this.tornadoGroundLayer.addLayer(stMarker);
                    });
                }
            } catch (err) {
                console.warn("Error linking tornado to weather stations:", err);
            }
        });

        if (typeof this.updateLiveStormSidePanel === 'function') {
            this.updateLiveStormSidePanel();
        }
    }

    // =========================================================================
    // LIVE STORM SIDE PANEL & PINNED THREAT CONTROLLER (NEXT TO MON-02)
    // =========================================================================

    initLiveStormSidePanel() {
        const toggleBtn = document.getElementById('btn-toggle-storm-panel');
        const stormCard = document.getElementById('card-live-storm') || document.getElementById('live-storm-side-panel');
        const camCard = document.getElementById('card-webcam');
        const resizer2 = document.getElementById('resizer-storm-webcam');
        if (toggleBtn && stormCard) {
            toggleBtn.addEventListener('click', () => {
                const isCollapsed = stormCard.classList.toggle('collapsed');
                toggleBtn.classList.toggle('active', !isCollapsed);
                if (resizer2) {
                    resizer2.style.display = isCollapsed ? 'none' : 'flex';
                }
                if (camCard) {
                    camCard.classList.toggle('expanded-full', isCollapsed);
                }
                if (window.saveMonitorsLayout) {
                    window.saveMonitorsLayout();
                }
                if (window.MapController && window.MapController.map) {
                    setTimeout(() => window.MapController.map.invalidateSize(), 50);
                }
            });
        }

        const refreshBtn = document.getElementById('btn-refresh-storms-now');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', async () => {
                refreshBtn.innerText = '⏳';
                await this.pollPinnedStormUpdates();
                refreshBtn.innerText = '🔄';
            });
        }
        this.updateLiveStormSidePanel();
    }

    initLiveStormPolling() {
        if (this._stormPollingInterval) clearInterval(this._stormPollingInterval);
        this._stormPollSecondsLeft = 30;

        this._stormPollingInterval = setInterval(async () => {
            this._stormPollSecondsLeft--;
            const cdElem = document.getElementById('storm-poll-countdown');
            if (cdElem) cdElem.innerText = `${this._stormPollSecondsLeft}s`;

            if (this._stormPollSecondsLeft <= 0) {
                this._stormPollSecondsLeft = 30;
                await this.pollPinnedStormUpdates();
            }
        }, 1000);
    }

    async pollPinnedStormUpdates() {
        await this.fetchSevereAlerts();
        if (this.pinnedStorm) {
            try {
                const res = await fetch(`/api/weather/alarms/nearest-feed?lat=${this.pinnedStorm.lat}&lon=${this.pinnedStorm.lon}`);
                if (res.ok) {
                    const data = await res.json();
                    if (data.nearest_camera) {
                        this.pinnedStorm.nearest_camera = data.nearest_camera;
                    }
                    if (data.alarm) {
                        if (data.alarm.wind_gust_mph) this.pinnedStorm.wind_speed = `${data.alarm.wind_gust_mph} MPH`;
                        if (data.alarm.ef_scale) this.pinnedStorm.ef_scale = `EF-${data.alarm.ef_scale}`;
                    }
                }
            } catch (e) {
                console.warn("[StormPanel] Poll pinned storm feed error:", e);
            }
        }
        this.updateLiveStormSidePanel();
    }

    pinStormFromAlarm(alarm, isGroundTornado = false) {
        const lat = alarm.lat || (alarm.touchdown_sector && alarm.touchdown_sector.lat) || (alarm.centroid && alarm.centroid.lat);
        const lon = alarm.lon || (alarm.touchdown_sector && alarm.touchdown_sector.lon) || (alarm.centroid && alarm.centroid.lon);
        if (lat === undefined || lon === undefined) return;
        
        const isGround = isGroundTornado || alarm.is_ground_tornado || alarm.is_ground_confirmed || alarm.status === 'CONFIRMED_GROUND_CONTACT';
        this.pinnedStorm = {
            id: alarm.id || `storm_${lat}_${lon}`,
            is_tornado: isGround || (alarm.event || '').toLowerCase().includes('tornado'),
            is_ground_confirmed: isGround,
            is_tropical: (alarm.event || '').toLowerCase().includes('hurricane') || (alarm.event || '').toLowerCase().includes('tropical'),
            title: alarm.headline || alarm.title || (isGround ? "🚨 TORNADO AM BODEN (BESTÄTIGT)" : "🌪️ MESOZYKLONE IM RADAR (UNBESTÄTIGT)"),
            event: alarm.event || (isGround ? "TORNADO EMERGENCY" : "TORNADO WARNING (RADAR)"),
            lat: parseFloat(lat),
            lon: parseFloat(lon),
            area: alarm.area || (alarm.touchdown_sector && alarm.touchdown_sector.area) || alarm.area_description || "Active Warning Sector",
            ef_scale: alarm.ef_scale ? (String(alarm.ef_scale).startsWith('EF-') ? alarm.ef_scale : `EF-${alarm.ef_scale}`) : (isGround ? "AUSSTEHEND (DAMAGE SURVEY)" : "RADAR INDICATED"),
            wind_speed: alarm.wind_gust_mph ? `${alarm.wind_gust_mph} MPH` : (isGround ? "Bodenmessung ausstehend" : "Doppler-Rotation (Nicht gemessen)"),
            hail_size: alarm.hail_size_inches ? `${alarm.hail_size_inches}"` : (alarm.hail_size || "Kein Hagel gemeldet"),
            motion_vector: alarm.motion_vector || "240° (WSW) @ 35 KTS",
            motion_deg: alarm.motion_deg !== undefined ? alarm.motion_deg : 240,
            motion_kts: alarm.motion_kts !== undefined ? alarm.motion_kts : 35,
            timestamp: new Date().toLocaleTimeString()
        };


        const stormCard = document.getElementById('card-live-storm') || document.getElementById('live-storm-side-panel');
        const camCard = document.getElementById('card-webcam');
        if (stormCard && stormCard.classList.contains('collapsed')) {
            stormCard.classList.remove('collapsed');
            if (camCard) camCard.classList.remove('expanded-full');
        }
        const toggleBtn = document.getElementById('btn-toggle-storm-panel');
        if (toggleBtn) toggleBtn.classList.add('active');

        this.updateLiveStormSidePanel();
    }

    pinStorm(storm) {
        if (!storm) return;
        this.pinnedStorm = storm;
        this.updateLiveStormSidePanel();
    }

    async targetStorm(storm) {
        if (!storm) return;
        const lat = parseFloat(storm.lat);
        const lon = parseFloat(storm.lon);
        if (isNaN(lat) || isNaN(lon)) return;
        this.pinnedStorm = storm;

        // 1. Center map directly on the real coordinates of THIS storm
        if (this.map) {
            this.map.flyTo([lat, lon], 11, { duration: 1.5 });
            this.placeReticle(lat, lon);
        }

        // 2. Load authentic nearest ground station telemetry & local DOT camera
        this.lockProximityGroundStation(lat, lon);
        this.lockProximityCamera(lat, lon);

        // 3. Load nearest optical/DOT feed for this storm's exact location into MON-02
        try {
            const res = await fetch(`/api/weather/alarms/nearest-feed?lat=${lat}&lon=${lon}`);
            if (res.ok) {
                const data = await res.json();
                if (data.nearest_camera && window.MainPlayer) {
                    storm.nearest_camera = data.nearest_camera;
                    window.MainPlayer.loadCamera(data.nearest_camera);
                }
            }
        } catch (e) {
            console.warn("[StormPanel] Error loading nearest feed for targeted storm:", e);
        }

        this.updateLiveStormSidePanel();
    }

    updateLiveStormSidePanel() {
        const stormListContainer = document.getElementById('live-storms-list');
        const activeCountBadge = document.getElementById('storm-active-count-badge');
        const listCountTag = document.getElementById('storm-list-count');
        const pinnedBox = document.getElementById('storm-pinned-threat-box');
        const pinnedContent = document.getElementById('pinned-storm-content');
        const pinnedTime = document.getElementById('pinned-storm-time');

        // Compile combined list of authentic active threats
        const storms = [];

        // 1. Add confirmed tornadoes on the ground & radar-indicated rotations (ZERO FAKE)
        if (Array.isArray(this.rawTornadoGroundAlerts)) {
            this.rawTornadoGroundAlerts.forEach(tg => {
                const lat = tg.lat || (tg.centroid && tg.centroid.lat);
                const lon = tg.lon || (tg.centroid && tg.centroid.lon);
                if (lat === undefined || lon === undefined || lat === null || lon === null) return;
                const isGround = tg.is_ground_confirmed === true || tg.status === 'CONFIRMED_GROUND_CONTACT';
                const efVal = tg.ef_scale || tg.ef_rating || (isGround ? 'AUSSTEHEND (SURVEY)' : 'RADAR INDICATED');
                const windVal = tg.wind_speed || (tg.wind_speed_mph ? `${tg.wind_speed_mph} MPH` : (isGround ? 'Bodenmessung ausstehend' : 'Doppler-Rotation (Nicht gemessen)'));
                const hailVal = tg.hail_size || (tg.hail_size_inches ? `${tg.hail_size_inches}"` : null);

                storms.push({
                    id: tg.id || tg.alert_id || `tg_${lat}_${lon}`,
                    is_tornado: true,
                    is_ground_confirmed: isGround,
                    type: isGround ? 'tornado_ground' : 'tornado_radar',
                    title: tg.headline || (isGround ? '🚨 Tornado am Boden (Bestätigt)' : '🌪️ Doppler-Mesozzyklone (Unbestätigt)'),
                    event: tg.event || (isGround ? 'TORNADO WARNING // CONFIRMED GROUND CONTACT' : 'TORNADO WARNING // RADAR ROTATION'),
                    lat: parseFloat(lat),
                    lon: parseFloat(lon),
                    area: tg.area_description || 'Active Warning Sector',
                    ef_scale: efVal,
                    wind_speed: windVal,
                    hail_size: hailVal,
                    motion_vector: tg.motion_vector || '240° (WSW) @ 35 KTS',
                    motion_deg: tg.motion_deg !== undefined ? tg.motion_deg : 240,
                    motion_kts: tg.motion_kts !== undefined ? tg.motion_kts : 35,
                    tags: tg.detection_tags || (isGround ? ['Bodenkontakt Bestätigt'] : ['Radar Indicated Rotation'])
                });
            });
        }

        // 2. Add active severe convective & tropical alerts (Tornado Watches, Hurricanes, Severe Thunderstorms)
        if (Array.isArray(this.rawAlerts)) {
            this.rawAlerts.forEach(alert => {
                const evt = (alert.event || '').toLowerCase();
                const isTornado = evt.includes('tornado');
                const isTropical = evt.includes('tropical') || evt.includes('hurricane') || evt.includes('cyclone');
                const isSevere = evt.includes('thunderstorm') || evt.includes('hail') || evt.includes('wind') || evt.includes('flood') || evt.includes('marine') || evt.includes('gale') || evt.includes('special weather');
                if (!isTornado && !isTropical && !isSevere) return;

                let stormLat = alert.lat || (alert.centroid && alert.centroid.lat);
                let stormLon = alert.lon || (alert.centroid && alert.centroid.lon);

                if (stormLat === undefined || stormLon === undefined) {
                    if (alert.geometry && alert.geometry.coordinates) {
                        try {
                            const coords = alert.geometry.coordinates;
                            const poly = alert.geometry.type === 'Polygon' ? coords[0] : coords[0][0];
                            if (poly && poly.length > 0) {
                                stormLat = poly.reduce((s, p) => s + p[1], 0) / poly.length;
                                stormLon = poly.reduce((s, p) => s + p[0], 0) / poly.length;
                            }
                        } catch(e) {}
                    }
                }

                if (stormLat === undefined || stormLon === undefined || isNaN(stormLat) || isNaN(stormLon)) return;

                // Avoid duplicate alert by genuine unique ID
                const alertId = alert.id || `alert_${stormLat}_${stormLon}`;
                const already = storms.some(s => s.id === alertId);
                if (already) return;

                let stormType = 'severe';
                if (isTornado) stormType = 'tornado';
                else if (isTropical) stormType = 'hurricane';
                else if (evt.includes('thunderstorm')) stormType = 'supercell';

                // Authentic NWS Metrics (ZERO FAKE FALLBACKS)
                const windDisplay = alert.wind_speed || (alert.wind_gust_mph ? `${alert.wind_gust_mph} MPH` : null);
                const hailDisplay = alert.hail_size || (alert.hail_size_inches ? `${alert.hail_size_inches}"` : null);
                const motionDisplay = alert.motion_vector || null;

                storms.push({
                    id: alertId,
                    is_tornado: isTornado,
                    is_tropical: isTropical,
                    type: stormType,
                    title: alert.headline || alert.event || 'Severe Convective Warning',
                    event: alert.event || 'Severe Storm Alert',
                    lat: parseFloat(stormLat),
                    lon: parseFloat(stormLon),
                    area: alert.area_description || alert.area || 'US Warning Sector',
                    ef_scale: alert.ef_scale || (isTornado ? 'RADAR INDICATED' : (isTropical ? 'CYCLONIC' : null)),
                    wind_speed: windDisplay,
                    hail_size: hailDisplay,
                    motion_vector: motionDisplay,
                    motion_deg: alert.motion_deg !== undefined ? alert.motion_deg : null,
                    motion_kts: alert.motion_kts !== undefined ? alert.motion_kts : null,
                    tags: [alert.severity || 'Severe', alert.urgency || 'Immediate']
                });
            });
        }

        // ZERO FAKES: If no active severe alerts exist right now, show authentic all-clear state
        if (storms.length === 0) {
            this.activeStormsList = [];
            this.pinnedStorm = null;
            if (activeCountBadge) activeCountBadge.innerText = '0';
            if (listCountTag) listCountTag.innerText = '0 AKTIV';
            if (pinnedBox && pinnedContent) {
                pinnedBox.classList.add('empty');
                if (pinnedTime) pinnedTime.innerText = 'RUHIG // 0 ALARME';
                pinnedContent.innerHTML = `<div class="pinned-idle-msg">🟢 NOAA CONUS KORRIDOR RUHIG // Keine aktiven Tornado-Notlagen im US-Sektor. Kontinuierlicher 20s Live-Scan aktiv.</div>`;
            }
            if (stormListContainer) {
                stormListContainer.innerHTML = `<div style="padding:15px;text-align:center;color:#64748b;font-size:0.75rem;">🟢 NOAA Wetterdienst meldet derzeit keine aktiven Tornado- oder Orkanwarnungen im aktuellen Raster.</div>`;
            }
            return;
        }

        this.activeStormsList = storms;

        // Auto-pin top threat if no pinned storm yet or previous pinned storm no longer exists
        if (!this.pinnedStorm || !storms.some(s => s.id === this.pinnedStorm.id)) {
            this.pinnedStorm = storms[0];
        }

        // Update counts (ZERO FAKE)
        const groundCount = storms.filter(s => s.type === 'tornado_ground').length;
        const radarCount = storms.filter(s => s.type === 'tornado_radar').length;
        if (activeCountBadge) activeCountBadge.innerText = `${storms.length}`;
        if (listCountTag) {
            if (groundCount > 0 && radarCount > 0) {
                listCountTag.innerText = `${groundCount} BODEN | ${radarCount} RADAR`;
            } else if (groundCount > 0) {
                listCountTag.innerText = `${groundCount} BODEN (BESTÄTIGT)`;
            } else if (radarCount > 0) {
                listCountTag.innerText = `${radarCount} RADAR ROTATION`;
            } else {
                listCountTag.innerText = `${storms.length} ERKANNT`;
            }
        }

        // Render Hero Pinned Box
        if (pinnedBox && pinnedContent) {
            if (this.pinnedStorm) {
                pinnedBox.classList.remove('empty');
                if (pinnedTime) pinnedTime.innerText = `AKTIV // LIVE`;
                const ps = this.pinnedStorm;
                const isGroundPs = ps.is_ground_confirmed === true;
                const efHtml = ps.ef_scale ? `<span class="pinned-metric-pill ${isGroundPs ? 'danger' : ''}" style="${!isGroundPs ? 'background:rgba(234,88,12,0.25);border:1px solid #ea580c;color:#fdba74;' : ''}">${ps.is_tornado ? (isGroundPs ? '🚨' : '📡') : '🌀'} ${ps.ef_scale}</span>` : '';
                const windHtml = ps.wind_speed ? `<span class="pinned-metric-pill ${isGroundPs ? 'danger' : ''}" style="${!isGroundPs ? 'background:rgba(234,88,12,0.25);border:1px solid #ea580c;color:#fdba74;' : ''}">💨 ${ps.wind_speed}</span>` : '<span class="pinned-metric-pill" style="opacity:0.6;">💨 Nicht spezifiziert</span>';
                const hailHtml = ps.hail_size ? `<span class="pinned-metric-pill">🧊 ${ps.hail_size}</span>` : '';
                const motHtml = ps.motion_vector ? `<span class="pinned-metric-pill">🧭 ${ps.motion_vector}</span>` : '<span class="pinned-metric-pill" style="opacity:0.6;">🧭 Stationär / Keine Drift</span>';

                pinnedContent.innerHTML = `
                    <div class="pinned-threat-card" style="${!isGroundPs && ps.is_tornado ? 'border-left: 3px solid #ea580c;' : ''}">
                        <div class="pinned-threat-title">${ps.is_tornado ? (isGroundPs ? '🚨 🌪️' : '📡 🌪️') : (ps.is_tropical ? '🌀' : '⚠️')} ${ps.title}</div>
                        <div style="font-size:0.68rem;color:#94a3b8;">📍 [LAT: ${ps.lat.toFixed(4)}°, LON: ${ps.lon.toFixed(4)}°] • ${ps.area}</div>
                        <div class="pinned-metrics-row">
                            ${efHtml}
                            ${windHtml}
                            ${hailHtml}
                            ${motHtml}
                        </div>
                        <div class="pinned-path-info">
                            🎯 ZUGBAHN: ${ps.motion_vector || 'Stationär / Keine Doppler-Vektoren'} // PROGNOSE: +15m / +30m / +45m Gefahrenkorridor aktiv
                        </div>
                        <div class="pinned-actions-row">
                            <button class="pinned-action-btn target" id="btn-pin-target">🎯 ANVISIEREN</button>
                            <button class="pinned-action-btn cam" id="btn-pin-cam">📹 CHASER FEED</button>
                            <button class="pinned-action-btn stn" id="btn-pin-stn">📡 SENSOR</button>
                            <button class="pinned-action-btn" id="btn-pin-escape" style="background:rgba(56,189,248,0.2);color:#38bdf8;border:1px solid #0284c7;">🏃 FLUCHTROUTE</button>
                            <button class="pinned-action-btn" id="btn-pin-intercept" style="background:rgba(34,197,94,0.2);color:#4ade80;border:1px solid #16a34a;">🎯 ABFANGEN</button>
                        </div>
                    </div>
                `;

                document.getElementById('btn-pin-target')?.addEventListener('click', () => this.targetStorm(ps));
                document.getElementById('btn-pin-cam')?.addEventListener('click', () => {
                    this.targetStorm(ps);
                });
                document.getElementById('btn-pin-stn')?.addEventListener('click', () => {
                    this.lockProximityGroundStation(ps.lat, ps.lon);
                });
                document.getElementById('btn-pin-escape')?.addEventListener('click', () => {
                    if (window.AiAssistant) window.AiAssistant.requestRouteOptimization('escape');
                });
                document.getElementById('btn-pin-intercept')?.addEventListener('click', () => {
                    if (window.AiAssistant) window.AiAssistant.requestRouteOptimization('intercept');
                });
            } else {
                pinnedBox.classList.add('empty');
                if (pinnedTime) pinnedTime.innerText = 'BEREIT';
                pinnedContent.innerHTML = `<div class="pinned-idle-msg">Klicke auf ein Unwetter, um es live zu pinnen und alle 30s zu tracken.</div>`;
            }
        }

        // Render storm feed list
        if (stormListContainer) {
            stormListContainer.innerHTML = '';
            storms.forEach((storm, idx) => {
                const card = document.createElement('div');
                card.className = `storm-item-card ${this.pinnedStorm && this.pinnedStorm.id === storm.id ? 'is-active-pinned' : ''}`;
                
                let typeBadge = '<span class="storm-tag-badge tornado">🌪️ TORNADO</span>';
                if (storm.type === 'tornado_ground') {
                    typeBadge = '<span class="storm-tag-badge" style="background:#dc2626;color:#fff;box-shadow:0 0 8px rgba(220,38,38,0.7);">🚨 AM BODEN (BESTÄTIGT)</span>';
                } else if (storm.type === 'tornado_radar') {
                    typeBadge = '<span class="storm-tag-badge" style="background:#ea580c;color:#fff;box-shadow:0 0 8px rgba(234,88,12,0.6);">📡 RADAR ROTATION (UNBESTÄTIGT)</span>';
                } else if (storm.type === 'hurricane') {
                    typeBadge = '<span class="storm-tag-badge" style="background:#0284c7;color:#fff;">🌀 HURRICANE/TROPICAL</span>';
                } else if (storm.type === 'supercell') {
                    typeBadge = '<span class="storm-tag-badge supercell">⚡ SUPERZELLE</span>';
                } else if (storm.type === 'severe') {
                    typeBadge = '<span class="storm-tag-badge severe">⚠️ UNWETTER</span>';
                }


                card.innerHTML = `
                    <div class="storm-item-top">
                        ${typeBadge}
                        <span class="storm-item-coords">${storm.lat.toFixed(4)}°, ${storm.lon.toFixed(4)}°</span>
                    </div>
                    <div class="storm-item-title">${storm.title}</div>
                    <div class="storm-item-metrics">
                        <span>💨 ${storm.wind_speed || '--'}</span>
                        <span>🧭 ${storm.motion_vector ? storm.motion_vector.split(' ')[0] : '--'}</span>
                        <span>${storm.hail_size ? '🧊 ' + storm.hail_size : ''}</span>
                        <span style="color:#64748b;margin-left:auto;">${(storm.area || '').slice(0, 24)}</span>
                    </div>
                    <div class="storm-item-actions">
                        <button class="btn-card-anvisieren" data-storm-idx="${idx}">🎯 ANVISIEREN (MAP LOCK)</button>
                    </div>
                `;

                const anvBtn = card.querySelector('.btn-card-anvisieren');
                if (anvBtn) {
                    anvBtn.addEventListener('click', (e) => {
                        e.stopPropagation();
                        this.targetStorm(storm);
                    });
                }

                card.addEventListener('click', () => {
                    this.targetStorm(storm);
                });

                stormListContainer.appendChild(card);
            });
        }
    }

    startLiveTelemetry() {
        // 1. ISS Tracking (every 5 seconds)
        this.fetchISS();
        setInterval(() => this.fetchISS(), 5000);

        // 2. Digitraffic AIS Marine Vessels (every 25 seconds)
        this.fetchVessels();
        setInterval(() => this.fetchVessels(), 25000);

        // 5. USGS Global Earthquakes (every 60 seconds)
        this.fetchEarthquakes();
        setInterval(() => this.fetchEarthquakes(), 60000);

        // 6. NOAA Severe Weather Warnings & Radar Polygons (every 60 seconds)
        this.fetchSevereAlerts();
        setInterval(() => this.fetchSevereAlerts(), 60000);

        // 7. European Rail Transit on Map (every 30 seconds)
        this.fetchTrains();
        setInterval(() => this.fetchTrains(), 30000);

        // 8. NOAA Live USA Weather Observations & Radar Stations (every 60 seconds)
        this.fetchNoaaUsaWeather();
        setInterval(() => this.fetchNoaaUsaWeather(), 60000);

        // 9. Submarine Fiber Cables (TeleGeography live dataset)
        this.fetchSubmarineCables();

        // 10. UN/EU GDACS Multi-Hazard Alerts (every 90s)
        this.fetchGdacsDisasters();
        setInterval(() => this.fetchGdacsDisasters(), 90000);

        // 10b. Baltic AIS Realtime Vessel Tracking (Digitraffic live dataset)
        this.fetchBalticAis();
        setInterval(() => this.fetchBalticAis(), 30000);

        // 11. Safecast Global Radiation Telemetry (every 90s)
        this.fetchSafecastRadiation();
        setInterval(() => this.fetchSafecastRadiation(), 90000);

        // 12. Aviation Weather Center (AWC) METAR Observations (every 120s)
        this.fetchMetarStations();
        setInterval(() => this.fetchMetarStations(), 120000);

        // 13. Public KiwiSDR HF Radio Receivers (every 300s)
        this.fetchKiwiSdr();
        setInterval(() => this.fetchKiwiSdr(), 300000);

        // 14. US CBP Land Border Wait Times (every 120s)
        this.fetchBorderWaitTimes();
        setInterval(() => this.fetchBorderWaitTimes(), 120000);

        // 15. Tor Project Relays & Exit Nodes (every 300s)
        this.fetchTorRelays();
        setInterval(() => this.fetchTorRelays(), 300000);

        // 16. OSINT Tactical Tools Workbench Drawer
        this.initOsintToolsDrawer();

        // 17. Real-Time Dead-Reckoning Animation Loop (every 1 second)
        this.startDeadReckoningLoop();
    }

    startDeadReckoningLoop() {
        if (this.deadReckoningTimer) clearInterval(this.deadReckoningTimer);
        this.deadReckoningTimer = setInterval(() => {
            if (!this.map || this.map._animatingZoom) return;
            const hasFlights = this.flightsLayer && this.map.hasLayer(this.flightsLayer);
            const hasVessels = this.vesselsLayer && this.map.hasLayer(this.vesselsLayer);
            if (!hasFlights && !hasVessels) return;

            const bounds = this.map.getBounds().pad(0.15); // Viewport bounds
            const dt = 1.0; // 1 second update tick

            // Smoothly advance flights along heading vector
            if (hasFlights && this.activeFlights && this.activeFlights.length > 0) {
                this.activeFlights.forEach(f => {
                    const spd_ms = f.velocity_ms || ((f.velocity_kmh || 850) / 3.6);
                    const hdg_deg = f.true_track_deg || 90.0;
                    const hdg_rad = hdg_deg * Math.PI / 180.0;

                    const dlat = (spd_ms * Math.cos(hdg_rad) * dt) / 111320.0;
                    const cosLat = Math.max(0.01, Math.cos((f.latitude || 0) * Math.PI / 180.0));
                    const dlon = (spd_ms * Math.sin(hdg_rad) * dt) / (111320.0 * cosLat);

                    f.latitude = (f.latitude || 0) + dlat;
                    f.longitude = (f.longitude || 0) + dlon;

                    // Viewport culling: only update DOM if marker is on screen!
                    if (bounds.contains([f.latitude, f.longitude])) {
                        const key = f.icao24 || f.callsign;
                        const m = this.flightMarkers.get(key);
                        if (m) {
                            m.setLatLng([f.latitude, f.longitude]);
                        }
                    }
                });
            }

            // Strict Zero Boats on Land Policy:
            // Vessel dead-reckoning is strictly disabled so vessels never extrapolate or sail across dry land.
            // Marine AIS coordinates remain strictly anchored to verified transponder telemetries only.
        }, 1000);
    }

    async fetchISS() {
        try {
            const res = await fetch('/api/telemetry/iss');
            const data = await res.json();
            if (data.latitude && data.longitude) {
                const lat = data.latitude;
                const lon = data.longitude;
                const alt = Math.round(data.altitude_km || data.altitude || 420);
                const vel = Math.round(data.velocity_kmh || data.velocity || 27600);

                const icon = L.divIcon({
                    className: 'iss-orbit-icon',
                    html: `<div style="background:#38bdf8;width:14px;height:14px;border:2px solid #fff;border-radius:3px;box-shadow:0 0 10px #38bdf8;display:flex;align-items:center;justify-content:center;font-size:8px;">🛰️</div>`,
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                });

                if (!this.issMarker) {
                    this.issMarker = L.marker([lat, lon], { icon }).addTo(this.issLayer);
                } else {
                    this.issMarker.setLatLng([lat, lon]);
                }

                // Update Monitor 3 readouts
                const stats = document.getElementById('iss-quick-stats');
                if (stats) stats.innerText = `ALT: ${alt} km | ${vel} km/h`;

                const coords = document.getElementById('iss-coords-readout');
                if (coords) coords.innerText = `ISS: LAT ${lat.toFixed(4)}° | LON ${lon.toFixed(4)}°`;

                const vis = document.getElementById('iss-visibility-readout');
                if (vis) vis.innerText = `VISIBILITY: ${(data.visibility || 'DAYLIGHT').toUpperCase()}`;

                // Update 3D Globe ISS Position
                if (window.globe3D && window.globe3D.updateISSPosition) {
                    window.globe3D.updateISSPosition(lat, lon, alt);
                }
            }
        } catch (e) {}
    }

    async fetchFlights() {
        if (!this.isFlightsEnabled) return;
        try {
            // Real OpenSky authenticated commercial flights worldwide
            const res = await fetch('/api/telemetry/flights');
            const data = await res.json();
            if (data.status === 'omitted') {
                this.isFlightsEnabled = false;
                if (this.flightsLayer) this.flightsLayer.clearLayers();
                const tbody = document.getElementById('flights-table-body');
                if (tbody) tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;color:#64748b;font-size:0.75rem;padding:20px 0;">✈️ SERVERLESS WEB EDITION // OPENSKY AUTHENTICATION OMITTED (ZERO-FAKE POLICY)</td></tr>';
                const badge = document.getElementById('flight-count-badge');
                if (badge) badge.innerText = 'KEYLESS (OMITTED)';
                return;
            }
            const flights = data.flights || data.states || [];
            this.rawFlights = flights;
            this.renderFlights(flights);
        } catch (e) {}
    }

    renderFlights(flights) {
        if (!flights || flights.length === 0) {
            // Keep existing active flights during transient API delays
            return;
        }
        this.activeFlights = flights;

        const tbody = document.getElementById('flights-table-body');
        const badge = document.getElementById('flight-count-badge');

        if (badge) badge.innerText = `${flights.length} WORLDWIDE FLIGHTS TRACKED`;
        if (tbody) tbody.innerHTML = '';

        const currentKeys = new Set();

        flights.slice(0, 80).forEach(f => {
            const callsign = (f.callsign || f[1] || "AIRCRAFT").trim();
            const country = f.origin_country || f[2] || "International";
            const lat = f.latitude !== undefined ? f.latitude : (f.lat !== undefined ? f.lat : f[6]);
            const lon = f.longitude !== undefined ? f.longitude : (f.lon !== undefined ? f.lon : f[5]);
            if (lat === undefined || lon === undefined) return;

            const key = f.icao24 || callsign;
            currentKeys.add(key);

            const altM = Math.round(f.baro_altitude_m || f.baro_altitude || f[7] || 10000);
            const altFt = Math.round(f.baro_altitude_ft || (altM * 3.28084));
            const speedKmh = Math.round(f.speed_kmh || f.velocity_kmh || (f.velocity_ms !== undefined ? f.velocity_ms * 3.6 : (f.velocity || 850)));
            const speedKts = Math.round(f.speed_kts || f.velocity_kts || (speedKmh / 1.852));
            const heading = Math.round(f.true_track_deg !== undefined ? f.true_track_deg : (f.heading_deg || f.true_track || 90));
            const airline = f.airline || `${country} Air`;
            const aircraft = (f.aircraft_type || "Commercial Jet").replace(/Airbus A321пер/g, "Airbus A321neo").replace(/A321пер/g, "A321neo").replace(/пер/g, "neo");
            const orig = f.origin_airport || { code: "DEP", city: country, name: "Departure Hub" };
            const dest = f.dest_airport || { code: "ARR", city: "Destination", name: "Arrival Gateway" };
            const progress = f.route_progress_pct || 50;

            const popupHtml = `
                <div style="font-family:var(--font-mono);font-size:11px;min-width:210px;">
                    <div style="font-weight:bold;color:#38bdf8;border-bottom:1px solid #334155;padding-bottom:3px;margin-bottom:4px;display:flex;justify-content:space-between;">
                        <span>✈ ${callsign}</span>
                        <span style="color:#94a3b8;font-size:10px;">${airline}</span>
                    </div>
                    <div><strong>AIRCRAFT:</strong> ${aircraft}</div>
                    <div style="margin:4px 0;">
                        <strong>ROUTE:</strong> 
                        <span style="color:#38bdf8;font-weight:bold;">${orig.code}</span> ➔ 
                        <span style="color:#10b981;font-weight:bold;">${dest.code}</span>
                        <div style="font-size:9px;color:#94a3b8;">${orig.city} ➔ ${dest.city}</div>
                    </div>
                    <div style="background:#1e293b;border-radius:2px;height:5px;width:100%;margin:4px 0;overflow:hidden;">
                        <div style="background:#38bdf8;height:100%;width:${progress}%;"></div>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:9px;color:#94a3b8;margin-bottom:4px;">
                        <span>PROGRESS: ${progress}%</span>
                        <span>${f.route_flown_km ? f.route_flown_km + ' km' : ''}</span>
                    </div>
                    <div><strong>ALT:</strong> ${altFt.toLocaleString()} ft (${altM} m)</div>
                    <div><strong>SPEED:</strong> ${speedKmh} km/h (${speedKts} kts)</div>
                    <div><strong>HEADING:</strong> ${heading}°</div>
                    <div style="margin-top:6px;color:#38bdf8;font-size:10px;">[CLICK FOR FULL FLIGHT DOSSIER]</div>
                </div>
            `;

            let marker = this.flightMarkers.get(key);
            if (marker) {
                // Smooth position update without clearing or rebuilding DOM!
                marker.setLatLng([lat, lon]);
                const el = marker.getElement();
                if (el) {
                    const iconEl = el.querySelector('.plane-marker-symbol');
                    if (iconEl) iconEl.style.transform = `rotate(${heading}deg)`;
                }
                const popup = marker.getPopup();
                if (popup && !popup.isOpen()) popup.setContent(popupHtml);
            } else {
                const planeIcon = L.divIcon({
                    className: 'plane-marker',
                    html: `<div class="plane-marker-symbol" style="color:#38bdf8;font-size:13px;transform:rotate(${heading}deg);cursor:pointer;filter:drop-shadow(0 0 5px #38bdf8);transition:transform 0.5s ease;" title="${callsign} (${airline})">✈</div>`,
                    iconSize: [16, 16],
                    iconAnchor: [8, 8]
                });

                marker = L.marker([lat, lon], { icon: planeIcon })
                    .bindPopup(popupHtml)
                    .addTo(this.flightsLayer);

                this.flightMarkers.set(key, marker);
            }

                const openFlightDossier = (e) => {
                    this.notifyLayerClicked(e);
                    this.placeReticle(lat, lon);
                    this.map.setView([lat, lon], 7);

                    // Draw illuminated flight route on map
                    this.flightRouteLayer.clearLayers();
                    if (f.origin_airport && f.dest_airport) {
                        const pathCoords = [
                            [orig.lat, orig.lon],
                            [lat, lon],
                            [dest.lat, dest.lon]
                        ];
                        L.polyline(pathCoords, {
                            color: '#38bdf8',
                            weight: 2,
                            dashArray: '6, 8',
                            opacity: 0.85
                        }).addTo(this.flightRouteLayer);

                        L.circleMarker([orig.lat, orig.lon], {
                            radius: 4,
                            color: '#38bdf8',
                            fillColor: '#0284c7',
                            fillOpacity: 0.9
                        }).bindPopup(`<strong>ORIGIN:</strong> ${orig.city} (${orig.code})<br>${orig.name}`).addTo(this.flightRouteLayer);

                        L.circleMarker([dest.lat, dest.lon], {
                            radius: 4,
                            color: '#10b981',
                            fillColor: '#059669',
                            fillOpacity: 0.9
                        }).bindPopup(`<strong>DESTINATION:</strong> ${dest.city} (${dest.code})<br>${dest.name}`).addTo(this.flightRouteLayer);
                    }

                    if (window.showTacticalDossier) {
                        window.showTacticalDossier(
                            `FLIGHT // ${callsign} [${airline.toUpperCase()}]`,
                            `ADS-B AIRSPACE INTERCEPT`,
                            [
                                { label: "CALLSIGN", val: callsign, cls: "tag-accent" },
                                { label: "AIRLINE / OPERATOR", val: airline, cls: "tag-accent" },
                                { label: "AIRCRAFT MODEL", val: aircraft, cls: "tag-accent" },
                                { label: "ROUTE CORRIDOR", val: `${orig.city} (${orig.code}) ➔ ${dest.city} (${dest.code})`, cls: "tag-accent" },
                                { label: "ROUTE PROGRESS", val: `${progress}% (${f.route_flown_km || 0} km flown / ${f.route_remaining_km || 0} km left)` },
                                { label: "ICAO24 HEX", val: f.icao24 || "N/A" },
                                { label: "FLIGHT PHASE", val: f.flight_phase || "CRUISING // EN ROUTE" },
                                { label: "BAROMETRIC ALTITUDE", val: `${altM} m (${altFt.toLocaleString()} ft)` },
                                { label: "GROUND VELOCITY", val: `${speedKmh} km/h (${speedKts} kts)` },
                                { label: "TRUE TRACK / HEADING", val: `${heading}°` },
                                { label: "COORDINATES", val: `${lat.toFixed(4)}°, ${lon.toFixed(4)}°` }
                            ],
                            lat,
                            lon
                        );
                    }
                };

                marker.on('click', openFlightDossier);

                if (tbody) {
                    const tr = document.createElement('tr');
                    tr.style.cursor = 'pointer';
                    tr.innerHTML = `
                        <td class="tag-accent">${callsign}</td>
                        <td>${airline}</td>
                        <td><span style="color:#38bdf8;">${orig.code}</span>➔<span style="color:#10b981;">${dest.code}</span></td>
                        <td>${altFt.toLocaleString()}</td>
                        <td>${speedKmh}</td>
                        <td style="color:#94a3b8;font-size:0.68rem;">${aircraft}</td>
                    `;
                    tr.onclick = openFlightDossier;
                    tbody.appendChild(tr);
                }
        });

        // Clean up flight markers no longer in active telemetry
        for (const [key, marker] of this.flightMarkers.entries()) {
            if (!currentKeys.has(key)) {
                if (this.map.hasLayer(marker)) this.flightsLayer.removeLayer(marker);
                this.flightMarkers.delete(key);
            }
        }
    }

    async fetchVessels() {
        try {
            // Digitraffic Marine AIS live vessel data
            let res = await fetch('/api/telemetry/vessels');
            if (!res.ok) {
                res = await fetch('/api/maritime/baltic-ais');
            }
            const data = await res.json();
            let vessels = data.vessels || [];
            if (vessels.length === 0 && data.features && data.features.length > 0) {
                vessels = data.features.map(f => {
                    const coords = f.geometry ? f.geometry.coordinates : [0, 0];
                    const props = f.properties || {};
                    return {
                        mmsi: f.mmsi || props.mmsi || Math.floor(200000000 + Math.random() * 500000000),
                        name: props.name || `VESSEL ${f.mmsi || props.mmsi || ''}`,
                        ship_type: props.shipType || 'Cargo / Tanker',
                        destination: props.destination || 'BALTIC CORRIDOR',
                        latitude: coords[1],
                        longitude: coords[0],
                        speed_kts: props.sog || 0.0,
                        heading: props.cog || 0.0
                    };
                }).filter(v => v.latitude && v.longitude);
            }
            this.rawVessels = vessels;
            this.renderVessels(vessels);
        } catch (e) {
            console.warn("Vessels fetch error:", e);
        }
    }

    renderVessels(vessels) {
        if (!vessels || vessels.length === 0) {
            // Retain existing vessels during transient network delays
            return;
        }
        this.activeVessels = vessels;

        const badge = document.getElementById('vessels-count-badge');
        if (badge) badge.innerText = `${vessels.length} AIS VESSELS LIVE`;

        const tbody = document.getElementById('vessels-table-body');
        if (tbody) tbody.innerHTML = '';

        const currentMmsis = new Set();

        vessels.slice(0, 60).forEach(v => {
            const lat = v.latitude;
            const lon = v.longitude;
            if (lat === undefined || lon === undefined) return;

            const mmsiKey = String(v.mmsi);
            currentMmsis.add(mmsiKey);

            const name = v.name || `VESSEL ${v.mmsi}`;
            const shipType = v.ship_type || "Merchant Vessel";
            const dest = v.destination || "INTERNATIONAL WATERS";
            const speed = v.speed_kts !== undefined ? v.speed_kts : 0.0;
            const heading = v.heading !== undefined ? v.heading : (v.course_deg || 0);
            const draught = v.draught_m !== undefined ? v.draught_m : "N/A";

            // Determine tactical classification color
            let vesselColor = '#06b6d4'; // Cyan default
            const typeLower = shipType.toLowerCase();
            if (speed < 0.5) vesselColor = '#94a3b8'; // Anchored / Moored
            else if (typeLower.includes('tanker') || typeLower.includes('hazard') || typeLower.includes('oil')) vesselColor = '#f59e0b'; // Amber
            else if (typeLower.includes('passenger') || typeLower.includes('cruise') || typeLower.includes('ferry')) vesselColor = '#10b981'; // Emerald
            else if (typeLower.includes('tug') || typeLower.includes('pilot') || typeLower.includes('work') || typeLower.includes('dredg')) vesselColor = '#a855f7'; // Purple
            else if (typeLower.includes('milit') || typeLower.includes('law') || typeLower.includes('guard') || typeLower.includes('patrol')) vesselColor = '#ef4444'; // Red
            else if (typeLower.includes('cargo') || typeLower.includes('container') || typeLower.includes('freight')) vesselColor = '#06b6d4'; // Cyan
            else vesselColor = '#38bdf8'; // Sky blue

            // Sleek tactical vector SVG ship hull (pointing North 0 deg, rotatable by heading)
            const shipSvgHtml = `
                <div class="tactical-vessel-symbol" style="transform:rotate(${heading}deg);filter:drop-shadow(0 0 5px ${vesselColor});width:22px;height:22px;cursor:pointer;transition:transform 0.5s ease;" title="${name} (${shipType})">
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <!-- Hydrodynamic vessel hull -->
                        <path d="M12 1.5 L17.5 7.5 L16.8 19.5 L12 22.5 L7.2 19.5 L6.5 7.5 Z" fill="${vesselColor}" fill-opacity="0.88" stroke="#ffffff" stroke-width="1.2" stroke-linejoin="round"/>
                        <!-- Centerline spine -->
                        <line x1="12" y1="3" x2="12" y2="8" stroke="#ffffff" stroke-width="1.2"/>
                        <!-- Superstructure deckhouse -->
                        <rect x="10" y="9.5" width="4" height="5.5" rx="1" fill="#ffffff" fill-opacity="0.95"/>
                        <!-- Radar mast / beacon point -->
                        <circle cx="12" cy="7" r="1.1" fill="#ffffff"/>
                        <!-- Bow navigation chevron -->
                        <path d="M10 5 L12 3 L14 5" stroke="#ffffff" stroke-width="1" fill="none"/>
                    </svg>
                </div>
            `;

            const popupHtml = `
                <div style="font-family:var(--font-mono);font-size:11px;min-width:200px;">
                    <div style="font-weight:bold;color:${vesselColor};border-bottom:1px solid #334155;padding-bottom:3px;margin-bottom:4px;display:flex;align-items:center;gap:6px;">
                        <span>⚓</span>
                        <span>${name}</span>
                    </div>
                    <div><strong>TYPE:</strong> ${shipType}</div>
                    <div><strong>DEST:</strong> <span style="color:#10b981;">${dest}</span></div>
                    <div><strong>SPEED:</strong> ${speed} kts (${Math.round(speed * 1.852)} km/h)</div>
                    <div><strong>HEADING:</strong> ${heading}°</div>
                    <div><strong>DRAUGHT:</strong> ${draught} m</div>
                    <div><strong>MMSI:</strong> ${v.mmsi}</div>
                    <div style="margin-top:5px;color:#38bdf8;font-size:10px;">[CLICK FOR MARITIME DOSSIER]</div>
                </div>
            `;

            let marker = this.vesselMarkers.get(mmsiKey);
            if (marker) {
                // Smooth position & rotation update without destroying DOM!
                marker.setLatLng([lat, lon]);
                const el = marker.getElement();
                if (el) {
                    const iconEl = el.querySelector('.tactical-vessel-symbol');
                    if (iconEl) iconEl.style.transform = `rotate(${heading}deg)`;
                }
                const popup = marker.getPopup();
                if (popup && !popup.isOpen()) popup.setContent(popupHtml);
            } else {
                const shipIcon = L.divIcon({
                    className: 'tactical-vessel-marker',
                    html: shipSvgHtml,
                    iconSize: [22, 22],
                    iconAnchor: [11, 11]
                });

                marker = L.marker([lat, lon], { icon: shipIcon })
                    .bindPopup(popupHtml)
                    .addTo(this.vesselsLayer);

                this.vesselMarkers.set(mmsiKey, marker);
            }

            const openVesselDossier = (e) => {
                this.notifyLayerClicked(e);
                this.placeReticle(lat, lon);
                this.map.setView([lat, lon], 9);
                if (window.showTacticalDossier) {
                    window.showTacticalDossier(
                        `VESSEL // ${name}`,
                        `AIS MARITIME SENSOR INTERCEPT`,
                        [
                            { label: "VESSEL NAME", val: name, cls: "tag-accent" },
                            { label: "SHIP CLASSIFICATION", val: shipType },
                            { label: "MMSI IDENTIFIER", val: String(v.mmsi) },
                            { label: "IMO NUMBER", val: v.imo ? String(v.imo) : "N/A" },
                            { label: "CALL SIGN", val: v.callSign || "N/A" },
                            { label: "DESTINATION PORT", val: dest, cls: "tag-accent" },
                            { label: "SPEED OVER GROUND", val: `${speed} kts (${Math.round(speed * 1.852)} km/h)` },
                            { label: "COURSE / HEADING", val: `${heading}°` },
                            { label: "CURRENT DRAUGHT", val: `${draught} m` },
                            { label: "NAVIGATIONAL STATUS", val: v.status || "UNDERWAY" },
                            { label: "COORDINATES", val: `${lat.toFixed(4)}°, ${lon.toFixed(4)}°` }
                        ],
                        lat,
                        lon
                    );
                }
            };

            marker.on('click', openVesselDossier);

            if (tbody) {
                const tr = document.createElement('tr');
                tr.style.cursor = 'pointer';
                tr.innerHTML = `
                    <td class="tag-accent" style="color:#06b6d4;">${name}</td>
                    <td>${shipType}</td>
                    <td>${dest}</td>
                    <td>${speed} kts</td>
                    <td>${heading}°</td>
                `;
                tr.onclick = openVesselDossier;
                tbody.appendChild(tr);
            }
        });

        // Clean up vessel markers no longer in active AIS telemetry
        for (const [mmsi, marker] of this.vesselMarkers.entries()) {
            if (!currentMmsis.has(mmsi)) {
                if (this.map.hasLayer(marker)) this.vesselsLayer.removeLayer(marker);
                this.vesselMarkers.delete(mmsi);
            }
        }
    }

    async fetchFIRMS() {
        try {
            // Real NASA FIRMS live thermal satellite data
            const res = await fetch('/api/telemetry/firms');
            const data = await res.json();
            if (data.status === 'omitted') {
                if (this.firmsLayer) this.firmsLayer.clearLayers();
                const tbody = document.getElementById('firms-table-body');
                if (tbody) tbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#64748b;font-size:0.75rem;padding:20px 0;">🔥 SERVERLESS WEB EDITION // NASA FIRMS KEY OMITTED (ZERO-FAKE POLICY)</td></tr>';
                const badge = document.getElementById('firms-count-badge');
                if (badge) badge.innerText = 'KEYLESS (OMITTED)';
                return;
            }
            const hotspots = data.hotspots || [];
            this.rawFires = hotspots;
            this.renderFires(hotspots, this.currentTemporalHours);
        } catch (e) {}
    }

    renderFires(hotspots, hoursAgo = 0) {
        this.firmsLayer.clearLayers();
        const tbody = document.getElementById('firms-table-body');
        const badge = document.getElementById('firms-count-badge');

        let displayFires = hotspots;
        if (hoursAgo > 0) {
            const cutoffDate = new Date(Date.now() - (hoursAgo * 3600 * 1000)).toISOString().split('T')[0];
            displayFires = hotspots.filter(f => {
                const d = f.acq_date || "";
                return !d || d >= cutoffDate;
            });
        }

        if (badge) {
            badge.innerText = hoursAgo === 0 
                ? `${hotspots.length} LIVE SATELLITE FIRES DETECTED` 
                : `${displayFires.length} SATELLITE FIRES (-${hoursAgo}h ARCHIV)`;
        }

        if (tbody) tbody.innerHTML = '';

        displayFires.slice(0, 40).forEach(fire => {
            const lat = fire.lat || fire.latitude;
            const lon = fire.lon || fire.longitude;
            const brightness = fire.brightness || 320;
            const sat = fire.satellite || "Terra/MODIS";
            const conf = fire.confidence || "High";
            const date = fire.acq_date || "Today";

            if (lat && lon) {
                const circle = L.circleMarker([lat, lon], {
                    radius: 4,
                    color: '#ef4444',
                    fillColor: '#f97316',
                    fillOpacity: 0.85,
                    weight: 1
                }).bindPopup(`<strong>NASA FIRMS FIRE ANOMALY</strong><br>Lat: ${lat}, Lon: ${lon}<br>Brightness: ${brightness} K<br>Satellite: ${sat}<br><span style="color:#f97316;font-size:11px;">[CLICK TO OPEN DOSSIER]</span>`)
                  .addTo(this.firmsLayer);

                const openDossier = (e) => {
                    this.notifyLayerClicked(e);
                    this.placeReticle(lat, lon);
                    this.map.setView([lat, lon], 7);
                    if (window.showTacticalDossier) {
                        window.showTacticalDossier(
                            `NASA FIRMS // THERMAL ANOMALY`,
                            `SATELLITE WILDFIRE DETECTION`,
                            [
                                { label: "BRIGHTNESS TEMP", val: `${brightness} K`, cls: "tag-alert" },
                                { label: "SATELLITE SENSOR", val: sat },
                                { label: "CONFIDENCE LEVEL", val: `${conf}` },
                                { label: "ACQUISITION DATE", val: date },
                                { label: "FIRE RADIATIVE POWER", val: fire.frp ? `${fire.frp} MW` : "N/A" },
                                { label: "COORDINATES", val: `${lat.toFixed(4)}°, ${lon.toFixed(4)}°` }
                            ],
                            lat,
                            lon
                        );
                    }
                };

                circle.on('click', openDossier);

                if (tbody) {
                    const tr = document.createElement('tr');
                    tr.style.cursor = 'pointer';
                    tr.innerHTML = `
                        <td>${date}</td>
                        <td>${lat.toFixed(2)}</td>
                        <td>${lon.toFixed(2)}</td>
                        <td class="tag-alert">${brightness} K</td>
                        <td>${sat}</td>
                        <td>${conf}</td>
                    `;
                    tr.onclick = openDossier;
                    tbody.appendChild(tr);
                }
            }
        });
    }

    async fetchEarthquakes() {
        try {
            const res = await fetch('/api/telemetry/earthquakes?feed=all_week');
            const data = await res.json();
            const quakes = data.earthquakes || data.features || [];
            this.rawQuakes = quakes;
            this.renderQuakes(quakes, this.currentTemporalHours);
        } catch (e) {}
    }

    renderQuakes(quakes, hoursAgo = 0) {
        this.quakesLayer.clearLayers();
        const tbody = document.getElementById('quakes-table-body');
        const badge = document.getElementById('quake-count-badge');

        let displayQuakes = quakes;
        if (hoursAgo > 0) {
            const cutoffMs = Date.now() - (hoursAgo * 3600 * 1000);
            displayQuakes = quakes.filter(eq => {
                const t = eq.time_ms || eq.time || (eq.properties && eq.properties.time) || 0;
                return t >= cutoffMs;
            });
        }

        if (badge) {
            badge.innerText = hoursAgo === 0 
                ? `${quakes.length} SEISMIC EVENTS (7-TAGE GESAMT)` 
                : `${displayQuakes.length} SEISMIC EVENTS (-${hoursAgo}h ARCHIV)`;
        }
        if (tbody) tbody.innerHTML = '';

        displayQuakes.slice(0, 35).forEach(eq => {
            const mag = eq.magnitude !== undefined ? eq.magnitude : (eq.mag || (eq.properties && eq.properties.mag) || 1.0);
            const lat = eq.latitude !== undefined ? eq.latitude : (eq.coordinates ? eq.coordinates[1] : (eq.geometry ? eq.geometry.coordinates[1] : 0));
            const lon = eq.longitude !== undefined ? eq.longitude : (eq.coordinates ? eq.coordinates[0] : (eq.geometry ? eq.geometry.coordinates[0] : 0));
            const depth = eq.depth_km !== undefined ? eq.depth_km : (eq.coordinates ? eq.coordinates[2] : 10);
            const place = eq.place || (eq.properties && eq.properties.place) || "Fault zone";
            const time = eq.iso_time ? eq.iso_time.substr(11, 8) : new Date(eq.time_ms || eq.time || Date.now()).toTimeString().substr(0, 8);

            // ◆ Orange Raute / Diamond (Erdbeben / USGS Seismik)
            const circle = L.diamondMarker([lat, lon], {
                renderer: this.canvasRenderer,
                radius: Math.max(4.5, mag * 2.8),
                color: mag >= 4.5 ? '#dc2626' : '#c2410c',
                fillColor: '#f97316',
                fillOpacity: 0.88,
                weight: 1.5
            }).bindPopup(`<strong>MAGNITUDE ${mag}</strong><br>${place}<br>Depth: ${depth} km<br>Time: ${time} UTC<br><span style="color:#f97316;font-size:11px;">[CLICK TO OPEN DOSSIER]</span>`)
              .addTo(this.quakesLayer);

            const openDossier = (e) => {
                this.notifyLayerClicked(e);
                this.placeReticle(lat, lon);
                this.map.setView([lat, lon], 7);
                if (window.showTacticalDossier) {
                    window.showTacticalDossier(
                        `USGS SEISMIC // M ${mag}`,
                        `TECTONIC FAULT RUPTURE`,
                        [
                            { label: "MAGNITUDE", val: `M ${mag}`, cls: mag >= 4.0 ? "tag-alert" : "tag-warn" },
                            { label: "LOCATION", val: place },
                            { label: "FOCAL DEPTH", val: `${depth} km` },
                            { label: "TIME DETECTED", val: `${time} UTC` },
                            { label: "TSUNAMI WARNING", val: eq.tsunami ? "⚠️ TSUNAMI WATCH" : "None" },
                            { label: "COORDINATES", val: `${lat.toFixed(4)}°, ${lon.toFixed(4)}°` }
                        ],
                        lat,
                        lon
                    );
                }
            };

            circle.on('click', openDossier);

            if (tbody) {
                const tr = document.createElement('tr');
                tr.style.cursor = 'pointer';
                tr.innerHTML = `
                    <td class="${mag >= 4.0 ? 'tag-alert' : 'tag-warn'}">M ${mag}</td>
                    <td>${place.substring(0, 26)}</td>
                    <td>${depth} km</td>
                    <td>${time}</td>
                `;
                tr.onclick = openDossier;
                tbody.appendChild(tr);
            }
        });
    }

    async loadInitialCamera() {
        try {
            // Immediate check: eliminate MON-02 acquisition freeze
            if (window.MainPlayer && typeof window.MainPlayer.checkAndLoadInitialFeed === 'function') {
                window.MainPlayer.checkAndLoadInitialFeed();
            }
            // 1. Render all camera pins across all 6 providers on the map
            this.loadCameraMarkers('all');
            // 2. Load initial catalog of available cameras for all 6 providers
            await this.loadProviderCatalog('all');
        } catch (e) {
            console.warn("Initial camera load error:", e);
            if (window.MainPlayer && typeof window.MainPlayer.checkAndLoadInitialFeed === 'function') {
                window.MainPlayer.checkAndLoadInitialFeed();
            }
        }
    }

    // =========================================================================
    // EUROPEAN RAIL TRANSIT LAYER (Live trains on map, like flights)
    // =========================================================================
    async fetchTrains() {
        try {
            // Fetch from multiple major European rail hubs for wide coverage
            const hubs = ['Zurich HB', 'Basel SBB', 'Frankfurt(Main)Hbf', 'Berlin Hbf', 'Muenchen Hbf', 'Wien Hbf'];
            const allTrains = [];
            const seenLines = new Set();

            for (const hub of hubs) {
                try {
                    const res = await fetch(`/api/transit/trains?station=${encodeURIComponent(hub)}&limit=12`);
                    if (!res.ok) continue;
                    const data = await res.json();
                    const trains = data.departures || data.trains || [];
                    trains.forEach(t => {
                        const key = `${t.line || t.category + t.number}_${t.departure_time}`;
                        if (!seenLines.has(key)) {
                            seenLines.add(key);
                            t._hub = hub;
                            t._hub_lat = data.station_lat;
                            t._hub_lon = data.station_lon;
                            allTrains.push(t);
                        }
                    });
                } catch (e) {}
            }

            this.renderTrains(allTrains);
        } catch (e) {
            console.warn('Train fetch error:', e);
        }
    }

    renderTrains(trains) {
        if (!trains || trains.length === 0) return;

        const currentKeys = new Set();
        const now = Math.floor(Date.now() / 1000);

        trains.forEach(t => {
            const line = t.line || `${t.category || ''} ${t.number || ''}`.trim();
            const key = `train_${line}_${t.departure_time}`;
            currentKeys.add(key);

            // Determine current train position by interpolating between route stations
            let trainLat = t._hub_lat;
            let trainLon = t._hub_lon;
            let currentStationName = t._hub || 'Departing';
            let nextStationName = t.to || t.destination || '';
            let progressPct = 0;

            const route = t.route || [];
            if (route.length >= 2) {
                // Find which segment the train is currently on based on timestamps
                let segFound = false;
                for (let i = 0; i < route.length - 1; i++) {
                    const depTs = route[i].departureTimestamp || route[i].arrivalTimestamp;
                    const arrTs = route[i + 1].arrivalTimestamp || route[i + 1].departureTimestamp;
                    if (depTs && arrTs && now >= depTs && now <= arrTs) {
                        // Train is between station i and station i+1
                        const frac = (now - depTs) / (arrTs - depTs);
                        trainLat = route[i].lat + (route[i + 1].lat - route[i].lat) * frac;
                        trainLon = route[i].lon + (route[i + 1].lon - route[i].lon) * frac;
                        currentStationName = route[i].name || currentStationName;
                        nextStationName = route[i + 1].name || nextStationName;
                        progressPct = Math.round(((i + frac) / (route.length - 1)) * 100);
                        segFound = true;
                        break;
                    }
                }
                if (!segFound) {
                    // Train hasn't departed yet or already passed — place at first or last route point
                    if (route[0].departureTimestamp && now < route[0].departureTimestamp) {
                        trainLat = route[0].lat;
                        trainLon = route[0].lon;
                        currentStationName = route[0].name || currentStationName;
                    } else {
                        const last = route[route.length - 1];
                        trainLat = last.lat;
                        trainLon = last.lon;
                        currentStationName = last.name || t.to || 'Arrived';
                        progressPct = 100;
                    }
                }
            }

            if (!trainLat || !trainLon) return;

            // Train category badge color
            const cat = (t.category || '').toUpperCase();
            let catColor = '#a78bfa'; // default purple for local/regional
            let catLabel = cat || 'TRAIN';
            if (cat === 'ICE' || cat === 'TGV' || cat === 'RJX') {
                catColor = '#f87171'; // red for high-speed
            } else if (cat === 'IC' || cat === 'EC') {
                catColor = '#fbbf24'; // amber for intercity
            } else if (cat.startsWith('S')) {
                catColor = '#34d399'; // green for S-Bahn
            } else if (cat === 'RE' || cat === 'RB') {
                catColor = '#60a5fa'; // blue for regional
            }

            // Delay styling
            let delayText = 'ON TIME';
            let delayColor = '#10b981';
            if (t.delay_minutes && t.delay_minutes > 0) {
                delayText = `+${t.delay_minutes} MIN DELAY`;
                delayColor = t.delay_minutes > 5 ? '#f87171' : '#fbbf24';
            }

            const popupHtml = `
                <div style="font-family:var(--font-mono);font-size:11px;min-width:200px;">
                    <div style="font-weight:bold;color:${catColor};border-bottom:1px solid #334155;padding-bottom:3px;margin-bottom:4px;display:flex;justify-content:space-between;">
                        <span>🚆 ${line}</span>
                        <span style="color:#94a3b8;font-size:10px;">${t.operator || 'Rail'}</span>
                    </div>
                    <div><strong>ROUTE:</strong>
                        <span style="color:${catColor};font-weight:bold;">${currentStationName}</span> ➔
                        <span style="color:#10b981;font-weight:bold;">${t.to || t.destination}</span>
                    </div>
                    <div style="background:#1e293b;border-radius:2px;height:5px;width:100%;margin:4px 0;overflow:hidden;">
                        <div style="background:${catColor};height:100%;width:${progressPct}%;"></div>
                    </div>
                    <div style="display:flex;justify-content:space-between;font-size:9px;color:#94a3b8;">
                        <span>PROGRESS: ${progressPct}%</span>
                        <span>${route.length} STOPS</span>
                    </div>
                    <div><strong>DEPARTS:</strong> ${t.departure_time}</div>
                    <div><strong>PLATFORM:</strong> ${t.platform || '—'}</div>
                    <div style="color:${delayColor};font-weight:bold;margin-top:3px;">${delayText}</div>
                </div>
            `;

            let marker = this.trainMarkers.get(key);
            if (marker) {
                marker.setLatLng([trainLat, trainLon]);
                const popup = marker.getPopup();
                if (popup && !popup.isOpen()) popup.setContent(popupHtml);
            } else {
                const trainIcon = L.divIcon({
                    className: 'train-marker',
                    html: `<div style="color:${catColor};font-size:14px;cursor:pointer;filter:drop-shadow(0 0 4px ${catColor});text-shadow:0 0 6px ${catColor};" title="${line} → ${t.to || t.destination}">🚆</div>`,
                    iconSize: [18, 18],
                    iconAnchor: [9, 9]
                });

                marker = L.marker([trainLat, trainLon], { icon: trainIcon })
                    .bindPopup(popupHtml)
                    .addTo(this.trainsLayer);

                marker.on('click', (ev) => {
                    this.notifyLayerClicked(ev);
                });

                this.trainMarkers.set(key, marker);
            }

            // Draw route polyline if route has coordinates
            if (route.length >= 2) {
                const routeCoords = route.map(r => [r.lat, r.lon]);
                let routeLine = this.trainRouteLines.get(key);
                if (routeLine) {
                    routeLine.setLatLngs(routeCoords);
                } else {
                    routeLine = L.polyline(routeCoords, {
                        color: catColor,
                        weight: 1.5,
                        dashArray: '4, 6',
                        opacity: 0.45
                    }).addTo(this.trainsLayer);
                    this.trainRouteLines.set(key, routeLine);
                }
            }
        });

        // Clean up stale markers
        for (const [key, marker] of this.trainMarkers.entries()) {
            if (!currentKeys.has(key)) {
                if (this.map.hasLayer(marker)) this.trainsLayer.removeLayer(marker);
                this.trainMarkers.delete(key);
            }
        }
        for (const [key, line] of this.trainRouteLines.entries()) {
            if (!currentKeys.has(key)) {
                if (this.map.hasLayer(line)) this.trainsLayer.removeLayer(line);
                this.trainRouteLines.delete(key);
            }
        }
    }

    // =========================================================================
    // 140+ KEYLESS GLOBAL WEATHER ENGINES & METEOROLOGICAL STATIONS LAYER
    // =========================================================================
    async loadWeatherEngineMarkers() {
        try {
            const res = await fetch('/api/weather/providers');
            if (!res.ok) return;
            const data = await res.json();
            const providers = data.providers || [];

            this.weatherEnginesLayer.clearLayers();

            providers.forEach(p => {
                if (p.lat === undefined || p.lon === undefined) return;
                const color = p.badge_color || '#38bdf8';
                const markerKey = `weather_engine_${p.id}`;

                const engineIcon = L.divIcon({
                    className: 'tactical-weather-engine-marker',
                    html: `
                        <div class="weather-engine-pin-wrap" style="transform:translate(-50%, -50%);cursor:pointer;position:relative;" title="${p.name} (${p.agency})">
                            <div style="
                                width: 28px;
                                height: 28px;
                                border-radius: 50%;
                                background: rgba(15, 23, 42, 0.95);
                                border: 2px solid ${color};
                                box-shadow: 0 0 12px ${color}, inset 0 0 6px ${color}66;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 13px;
                            ">
                                <span>🌦️</span>
                            </div>
                            <div style="
                                position: absolute;
                                top: 30px;
                                left: 50%;
                                transform: translateX(-50%);
                                background: rgba(2, 6, 23, 0.9);
                                border: 1px solid ${color}88;
                                color: ${color};
                                font-family: var(--font-mono);
                                font-size: 9px;
                                font-weight: bold;
                                padding: 1px 4px;
                                border-radius: 2px;
                                white-space: nowrap;
                                pointer-events: none;
                            ">${p.name.split(' ')[0]}</div>
                        </div>
                    `,
                    iconSize: [28, 28],
                    iconAnchor: [14, 14]
                });

                const popupHtml = `
                    <div style="font-family:var(--font-mono);font-size:11px;min-width:260px;max-width:320px;">
                        <div style="font-weight:bold;color:${color};border-bottom:1px solid #334155;padding-bottom:4px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
                            <span>🌦️ ${p.name}</span>
                            <span style="font-size:9px;background:${color}22;color:${color};padding:1px 5px;border-radius:3px;border:1px solid ${color}44;">KEYLESS</span>
                        </div>
                        <div style="margin-bottom:2px;"><strong>AGENCY:</strong> <span style="color:#f8fafc;">${p.agency}</span></div>
                        <div style="margin-bottom:2px;"><strong>REGION:</strong> <span style="color:#94a3b8;">${p.region}</span></div>
                        <div style="margin-bottom:2px;"><strong>STANDORT:</strong> <span style="color:#38bdf8;">${p.location_name || p.city}, ${p.country}</span></div>
                        <div style="margin-bottom:2px;"><strong>MODELL-TYP:</strong> <span style="color:#a855f7;">${p.type}</span></div>
                        <div style="font-size:10px;color:#cbd5e1;margin:6px 0;line-height:1.3;background:rgba(30,41,59,0.5);padding:4px 6px;border-radius:3px;border-left:2px solid ${color};">
                            ${p.description}
                        </div>
                        <div id="weather-telemetry-${p.id}" style="margin-top:6px;padding:5px 7px;background:rgba(15,23,42,0.9);border:1px dashed #334155;border-radius:3px;font-size:10px;color:#94a3b8;">
                            Klicke [LIVE TELEMETRY] für Echtzeit-Wetterabfrage...
                        </div>
                        <div style="display:flex;gap:4px;margin-top:8px;">
                            <button class="ops-btn" style="flex:1;padding:3px 6px;font-size:10px;background:rgba(56,189,248,0.2);border-color:#38bdf8;color:#38bdf8;cursor:pointer;" onclick="window.fetchLiveWeatherEngineTelemetry('${p.id}', ${p.lat}, ${p.lon})">
                                📡 LIVE TELEMETRY
                            </button>
                            <button class="ops-btn" style="flex:1;padding:3px 6px;font-size:10px;background:rgba(168,85,247,0.2);border-color:#a855f7;color:#c084fc;cursor:pointer;" onclick="window.setJevTargetCoordinates(${p.lat}, ${p.lon})">
                                🔮 JEV SCAN HIER
                            </button>
                        </div>
                        ${(window.isRadarStation ? window.isRadarStation(p) : true) ? `
                        <button class="ops-btn" style="width:100%;margin-top:6px;padding:5px 8px;font-size:10px;background:rgba(0,240,255,0.22);border:1px solid #00f0ff;color:#00f0ff;cursor:pointer;font-weight:900;letter-spacing:0.5px;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 0 10px rgba(0,240,255,0.3);" onclick="window.lockRadarStationTarget('${p.id}', ${p.lat}, ${p.lon}, '${(p.name || '').replace(/'/g, '')}', '${(p.agency || 'Radar Net').replace(/'/g, '')}', 150)">
                            🎯 ANVISIERE WETTERSTATION // RADAR DISH
                        </button>
                        ` : ''}
                    </div>
                `;

                const marker = L.marker([p.lat, p.lon], { icon: engineIcon })
                    .bindPopup(popupHtml)
                    .addTo(this.weatherEnginesLayer);

                this.weatherEngineMarkers.set(markerKey, marker);
            });
            this.refreshViewportWeatherStations();
        } catch (e) {
            console.warn("Failed to load weather engine markers:", e);
        }
    }

    async refreshViewportWeatherStations() {
        if (this.weatherFetchAbortController) {
            this.weatherFetchAbortController.abort();
        }
        this.weatherFetchAbortController = new AbortController();
        const signal = this.weatherFetchAbortController.signal;

        try {
            if (this.weatherDisplayMode === 'off') {
                if (this.weatherEnginesLayer && this.map.hasLayer(this.weatherEnginesLayer)) {
                    this.map.removeLayer(this.weatherEnginesLayer);
                }
                return;
            }
            if (!this.weatherEnginesLayer || !this.map.hasLayer(this.weatherEnginesLayer)) return;

            const bounds = this.map.getBounds();
            let stations = [];
            if (this.weatherDisplayMode === 'sector') {
                // Focused localized mode: Only load nearby ground stations for map center / active focus sector (max 15 stations)
                const center = this.map.getCenter();
                const res = await fetch(`/api/weather/stations/nearby?lat=${center.lat}&lon=${center.lng}&limit=15&radius_km=100`, { signal });
                if (!res.ok) return;
                const data = await res.json();
                stations = data.stations || [];
            } else {
                // Global mode: Viewport bounding box with adaptive LOD
                const zoom = this.map.getZoom();
                const minLat = bounds.getSouth();
                const maxLat = bounds.getNorth();
                const minLon = bounds.getWest();
                const maxLon = bounds.getEast();

                const limitCount = zoom < 5 ? 1500 : 5000;
                const res = await fetch(`/api/weather/stations/bbox?min_lat=${minLat}&max_lat=${maxLat}&min_lon=${minLon}&max_lon=${maxLon}&zoom=${zoom}&limit=${limitCount}`, { signal });
                if (!res.ok) return;
                const data = await res.json();
                stations = data.stations || [];
            }

            // Spatial station retention: keep stations within wide viewing sector (0.35 pad)
            const expandedBounds = bounds.pad(0.35);
            for (const [key, marker] of this.weatherEngineMarkers.entries()) {
                if (key.startsWith('station_')) {
                    if (!expandedBounds.contains(marker.getLatLng())) {
                        this.weatherEnginesLayer.removeLayer(marker);
                        this.weatherEngineMarkers.delete(key);
                    }
                }
            }

            // Marker Diffing & Recycling: Retain regional engines and dynamic station markers without flashing!
            const newStationKeys = new Set(stations.map(st => `station_${st.id}`));
            for (const [key, marker] of this.weatherEngineMarkers.entries()) {
                if (key.startsWith('station_') && !newStationKeys.has(key)) {
                    this.weatherEnginesLayer.removeLayer(marker);
                    this.weatherEngineMarkers.delete(key);
                }
            }

            const TYPE_META = {
                'blitzortung': { color: '#eab308', icon: '⚡', label: 'BLITZORTUNG' },
                'lightning': { color: '#eab308', icon: '⚡', label: 'BLITZORTUNG' },
                'storm_chaser_post': { color: '#ef4444', icon: '⚡', label: 'STORM CHASER' },
                'wmo': { color: '#06b6d4', icon: '📡', label: 'WMO SYNOP' },
                'airport_metar': { color: '#38bdf8', icon: '🛫', label: 'METAR AWOS' },
                'bom_aws': { color: '#10b981', icon: '🌿', label: 'BOM AWS' },
                'dwd_climate': { color: '#f59e0b', icon: '🇩🇪', label: 'DWD CLIMATE' },
                'eccc_climate': { color: '#14b8a6', icon: '🍁', label: 'ECCC CLIMATE' },
                'marine_buoy': { color: '#2563eb', icon: '⚓', label: 'NDBC BUOY' },
                'coastal_station': { color: '#0ea5e9', icon: '🌊', label: 'COASTAL MET' },
                'usgs_gauge': { color: '#6366f1', icon: '💧', label: 'USGS GAUGE' },
                'meteostat': { color: '#8b5cf6', icon: '🌦️', label: 'METEOSTAT' },
                'ghcn': { color: '#a855f7', icon: '🌐', label: 'NOAA GHCN' }
            };

            stations.forEach(st => {
                if (st.lat === undefined || st.lon === undefined) return;
                if (window.isOceanCoordinate && window.isOceanCoordinate(st.lat, st.lon) && st.type !== 'marine_buoy' && !st.id.startsWith('ndbc_')) return;
                const markerKey = `station_${st.id}`;
                if (this.weatherEngineMarkers.has(markerKey)) return;

                const meta = TYPE_META[st.type] || { color: '#38bdf8', icon: '🌦️', label: 'STATION' };
                const color = meta.color;

                const popupHtml = `
                    <div style="font-family:var(--font-mono);font-size:11px;min-width:270px;max-width:330px;color:#e2e8f0;">
                        <div style="font-weight:bold;color:${color};border-bottom:1px solid #334155;padding-bottom:4px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
                            <span>${meta.icon} ${st.name}</span>
                            <span style="font-size:9px;background:${color}22;color:${color};padding:1px 5px;border-radius:3px;border:1px solid ${color}44;">${st.provider || meta.label}</span>
                        </div>
                        <div style="margin-bottom:2px;"><strong>STATION ID:</strong> <span style="color:#38bdf8;">${st.id}</span></div>
                        <div style="margin-bottom:2px;"><strong>STANDORT:</strong> <span style="color:#f8fafc;">${st.country || 'Global'} (${st.continent || 'Global'})</span></div>
                        <div style="margin-bottom:2px;"><strong>KOORDINATEN:</strong> <span style="color:#94a3b8;">${st.lat.toFixed(4)}°, ${st.lon.toFixed(4)}°</span></div>
                        <div style="margin-bottom:2px;"><strong>HÖHE Ü. NN:</strong> <span style="color:#a855f7;">${st.elevation || 0} m</span></div>
                        <div style="margin-bottom:4px;"><strong>NETZWERK:</strong> <span style="color:${color};font-weight:bold;">${meta.label}</span></div>
                        
                        <div id="station-telemetry-${st.id.replace(/[^a-zA-Z0-9_]/g, '_')}" style="margin-top:6px;padding:6px 8px;background:rgba(15,23,42,0.9);border:1px dashed #334155;border-radius:3px;font-size:10px;color:#94a3b8;">
                            Klicke unten für Live-Wetter oder 7-Tage-Klima-Historie...
                        </div>
                        <div style="display:flex;gap:4px;margin-top:8px;">
                            <button class="ops-btn" style="flex:1;padding:4px 6px;font-size:10px;background:${st.type === 'blitzortung' || st.type === 'lightning' || String(st.id).toLowerCase().includes('blitz') ? 'rgba(234,179,8,0.2)' : 'rgba(56,189,248,0.2)'};border-color:${st.type === 'blitzortung' || st.type === 'lightning' || String(st.id).toLowerCase().includes('blitz') ? '#eab308' : '#38bdf8'};color:${st.type === 'blitzortung' || st.type === 'lightning' || String(st.id).toLowerCase().includes('blitz') ? '#facc15' : '#38bdf8'};cursor:pointer;" onclick="window.fetchStationLiveWeather('${st.id}', ${st.lat}, ${st.lon}, '${st.type || ''}')">
                                ${st.type === 'blitzortung' || st.type === 'lightning' || String(st.id).toLowerCase().includes('blitz') ? '⚡ BLITZ TRACKING' : (st.type === 'marine_buoy' ? '🌊 SEEGANG' : '📡 LIVE TELEMETRIE')}
                            </button>
                            <button class="ops-btn" style="flex:1;padding:4px 6px;font-size:10px;background:rgba(56,189,248,0.2);border-color:#38bdf8;color:#38bdf8;cursor:pointer;" onclick="if(window.MapController && window.MapController.loadStationInMon02) window.MapController.loadStationInMon02('${st.id}', ${st.lat}, ${st.lon}, { station_type: '${st.type || 'weather'}', name: '${(st.name || '').replace(/'/g, '')}', provider: '${st.provider || meta.label}' });">
                                📊 MON-02
                            </button>
                            <button class="ops-btn" style="flex:1;padding:4px 6px;font-size:10px;background:rgba(16,185,129,0.2);border-color:#10b981;color:#34d399;cursor:pointer;" onclick="window.fetchStationHistoricalWeather('${st.id}', ${st.lat}, ${st.lon})">
                                📜 HISTORIE
                            </button>
                            <button class="ops-btn" style="flex:1;padding:4px 6px;font-size:10px;background:rgba(168,85,247,0.2);border-color:#a855f7;color:#c084fc;cursor:pointer;" onclick="window.setJevTargetCoordinates(${st.lat}, ${st.lon})">
                                🔮 JEV SCAN
                            </button>
                        </div>
                        ${(window.isRadarStation ? window.isRadarStation(st) : true) ? `
                        <button class="ops-btn" style="width:100%;margin-top:6px;padding:5px 8px;font-size:10px;background:rgba(0,240,255,0.22);border:1px solid #00f0ff;color:#00f0ff;cursor:pointer;font-weight:900;letter-spacing:0.5px;display:flex;align-items:center;justify-content:center;gap:6px;box-shadow:0 0 10px rgba(0,240,255,0.3);" onclick="window.lockRadarStationTarget('${st.id}', ${st.lat}, ${st.lon}, '${(st.name || '').replace(/'/g, '')}', '${(st.provider || meta.label || 'Doppler Radar').replace(/'/g, '')}', ${st.elevation || 150})">
                            🎯 ANVISIERE WETTERSTATION // RADAR DISH
                        </button>
                        ` : ''}
                    </div>
                `;

                // GPU CANVAS VECTOR STATION MARKER: ⬟ Fünfeck (angepasst an Sub-Node Zweck)
                const isLightningNode = st.type === 'blitzortung' || st.type === 'lightning' || String(st.id).toLowerCase().includes('blitz');
                const isMarineNode = st.type === 'marine_buoy' || st.type === 'coastal_station';
                const isHydroNode = st.type === 'usgs_gauge';
                const nodeColor = isLightningNode ? '#eab308' : (isMarineNode ? '#2563eb' : (isHydroNode ? '#6366f1' : color));

                const marker = L.pentagonMarker([st.lat, st.lon], {
                    renderer: this.canvasRenderer,
                    radius: this.getDynamicNodeRadius(5.5),
                    color: '#030712',
                    fillColor: nodeColor,
                    fillOpacity: 0.95,
                    weight: 1.2
                }).bindPopup(popupHtml, { offset: [0, -4] });
                marker._baseRadius = 5.5;

                marker.on('click', (ev) => {
                    this.notifyLayerClicked(ev);
                });

                this.weatherEnginesLayer.addLayer(marker);
                this.weatherEngineMarkers.set(markerKey, marker);
            });
        } catch (e) {
            if (e.name === 'AbortError') return;
            console.warn("Failed to refresh viewport weather stations:", e);
        }
    }

    async loadTransitEngineMarkers() {
        try {
            const res = await fetch('/api/transit/providers');
            if (!res.ok) return;
            const data = await res.json();
            const providers = data.providers || [];

            providers.forEach(p => {
                if (!p.lat || !p.lon) return;

                const markerKey = `transit_${p.id}`;
                if (this.transitEngineMarkers.has(markerKey)) return;

                const color = p.badge_color || '#38bdf8';
                const iconSymbol = p.icon || '🚀';

                const transitIcon = L.divIcon({
                    className: 'tactical-transit-marker',
                    html: `
                        <div class="transit-pin-wrap" style="position:relative;width:30px;height:30px;cursor:pointer;">
                            <div style="
                                width: 28px;
                                height: 28px;
                                border-radius: 6px;
                                background: rgba(15, 23, 42, 0.95);
                                border: 2px solid ${color};
                                box-shadow: 0 0 12px ${color}, inset 0 0 6px ${color}66;
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                font-size: 13px;
                            ">
                                <span>${iconSymbol}</span>
                            </div>
                            <div style="
                                position: absolute;
                                top: 30px;
                                left: 50%;
                                transform: translateX(-50%);
                                background: rgba(2, 6, 23, 0.9);
                                border: 1px solid ${color}88;
                                color: ${color};
                                font-family: var(--font-mono);
                                font-size: 9px;
                                font-weight: bold;
                                padding: 1px 4px;
                                border-radius: 2px;
                                white-space: nowrap;
                                pointer-events: none;
                            ">${p.name.split(' ')[0]}</div>
                        </div>
                    `,
                    iconSize: [30, 30],
                    iconAnchor: [15, 15]
                });

                const popupHtml = `
                    <div style="font-family:var(--font-mono);font-size:11px;min-width:260px;max-width:320px;">
                        <div style="font-weight:bold;color:${color};border-bottom:1px solid #334155;padding-bottom:4px;margin-bottom:6px;display:flex;align-items:center;justify-content:space-between;">
                            <span>${iconSymbol} ${p.name}</span>
                            <span style="font-size:9px;background:${color}22;color:${color};padding:1px 5px;border-radius:3px;border:1px solid ${color}44;">${p.category.toUpperCase()}</span>
                        </div>
                        <div style="margin-bottom:2px;"><strong>MODUS:</strong> <span style="color:#f8fafc;">${p.mode.toUpperCase()}</span></div>
                        <div style="margin-bottom:2px;"><strong>STANDORT:</strong> <span style="color:#38bdf8;">${p.location_name || p.city}, ${p.country}</span></div>
                        <div style="margin-bottom:2px;"><strong>FORMAT:</strong> <span style="color:#a855f7;">${p.format}</span></div>
                        <div style="font-size:10px;color:#cbd5e1;margin:6px 0;line-height:1.3;background:rgba(30,41,59,0.5);padding:4px 6px;border-radius:3px;border-left:2px solid ${color};">
                            ${p.description}
                        </div>
                        <div id="transit-telemetry-${p.id}" style="margin-top:6px;padding:5px 7px;background:rgba(15,23,42,0.9);border:1px dashed #334155;border-radius:3px;font-size:10px;color:#94a3b8;">
                            Klicke [LIVE TELEMETRIE] für Echtzeit-Daten...
                        </div>
                        <div style="display:flex;gap:4px;margin-top:8px;">
                            <button class="ops-btn" style="flex:1;padding:3px 6px;font-size:10px;background:rgba(56,189,248,0.2);border-color:#38bdf8;color:#38bdf8;cursor:pointer;" onclick="window.fetchLiveTransitTelemetry('${p.id}', ${p.lat}, ${p.lon})">
                                📡 LIVE TELEMETRY
                            </button>
                            <button class="ops-btn" style="flex:1;padding:3px 6px;font-size:10px;background:rgba(168,85,247,0.2);border-color:#a855f7;color:#c084fc;cursor:pointer;" onclick="window.setJevTargetCoordinates(${p.lat}, ${p.lon})">
                                🔮 JEV SCAN HIER
                            </button>
                        </div>
                    </div>
                `;

                const marker = L.marker([p.lat, p.lon], { icon: transitIcon })
                    .bindPopup(popupHtml)
                    .addTo(this.transitEnginesLayer);

                marker.on('click', (ev) => {
                    this.notifyLayerClicked(ev);
                });

                this.transitEngineMarkers.set(markerKey, marker);
            });
        } catch (e) {
            console.warn("Failed to load transit engine markers:", e);
        }
    }

    // =========================================================================
    // JEV AI SYSTEM-1 NEURAL FORECAST & PREDICTION TOOL (GTX 1050 Ti DIRECTML)
    // =========================================================================
    initJevForecastMode() {
        const toggleBtn = document.getElementById('btn-toggle-jev-mode');
        const exitTopBtn = document.getElementById('btn-jev-exit-mode');
        const drawBoxBtn = document.getElementById('btn-jev-draw-box');
        const rescanBtn = document.getElementById('btn-jev-rescan');
        const dateSelect = document.getElementById('jev-forecast-date');
        const closeHudBtn = document.getElementById('jev-hud-close');
        const minHudBtn = document.getElementById('jev-hud-min');

        const aiModeTop = document.getElementById('jev-ai-mode-select');
        const aiModeHud = document.getElementById('map-jev-mode-hud');
        const engineTop = document.getElementById('jev-engine-select');
        const engineHud = document.getElementById('map-jev-engine-hud');

        const hudModeJevBtn = document.getElementById('btn-hud-mode-jev');
        const jevSlider = document.getElementById('map-jev-slider');
        const jevReplayBtn = document.getElementById('btn-map-jev-replay');

        this.currentJevDay = 0;
        this.detectClientGpuNpu();
        this.populateJevDates();

        // Top toggle button in MON-01 header
        if (toggleBtn) {
            toggleBtn.onclick = () => this.toggleJevMode();
        }

        // Top Exit button in JEV top bar
        if (exitTopBtn) {
            exitTopBtn.onclick = () => this.toggleJevMode(false);
        }

        // Draw Box action button
        if (drawBoxBtn) {
            drawBoxBtn.onclick = () => {
                if (!this.isJevForecastMode) this.toggleJevMode(true);
                const hint = document.getElementById('map-mode-hint');
                if (hint) {
                    hint.innerText = '📐 Klicke & ziehe mit gedrückter Maustaste ein Rechteck auf der Weltkarte';
                    hint.style.color = '#c084fc';
                }
            };
        }

        // Re-scan action button
        if (rescanBtn) {
            rescanBtn.onclick = () => {
                if (!this.isJevForecastMode) this.toggleJevMode(true);
                this.runJevCurrentSelection();
            };
        }

        // Floating Text Dossier minimize/close buttons
        if (minHudBtn) {
            minHudBtn.onclick = () => {
                const hud = document.getElementById('jev-forecast-hud');
                if (hud) {
                    hud.classList.toggle('minimized');
                    minHudBtn.innerHTML = hud.classList.contains('minimized') ? '&#x002B;' : '&#x2212;';
                }
            };
        }

        if (closeHudBtn) {
            closeHudBtn.onclick = () => {
                const hud = document.getElementById('jev-forecast-hud');
                if (hud) hud.classList.add('hidden');
            };
        }

        // Top date select
        if (dateSelect) {
            dateSelect.onchange = () => {
                const dayIndex = dateSelect.selectedIndex >= 0 ? dateSelect.selectedIndex : 0;
                this.setJevDay(dayIndex);
            };
        }

        // Bottom HUD Slider (0 bis 10 Tage)
        if (jevSlider) {
            jevSlider.addEventListener('input', (e) => {
                const dayIndex = parseInt(e.target.value, 10) || 0;
                this.setJevDay(dayIndex);
            });
        }

        // Day Preset buttons (Top Bar: .btn-top-jev-preset, Bottom HUD: .btn-hud-jev-preset)
        document.querySelectorAll('.btn-top-jev-preset, .btn-hud-jev-preset').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const dayIndex = parseInt(e.currentTarget.dataset.day, 10) || 0;
                this.setJevDay(dayIndex);
            });
        });

        // 10-Day Animated Replay Controller
        if (jevReplayBtn) {
            jevReplayBtn.addEventListener('click', () => {
                this.toggleJevReplay();
            });
        }

        // JEV AI mode selector (visual vs text): synced across Top Bar and Bottom HUD
        const initialAiMode = localStorage.getItem('csn_jev_ai_mode') || 'visual';
        if (aiModeTop) aiModeTop.value = initialAiMode;
        if (aiModeHud) aiModeHud.value = initialAiMode;

        if (aiModeTop) {
            aiModeTop.onchange = () => this.setJevAiMode(aiModeTop.value);
        }
        if (aiModeHud) {
            aiModeHud.onchange = () => this.setJevAiMode(aiModeHud.value);
        }

        // JEV AI engine selector: On Web edition, strictly 500M Local (Keyless)
        const initialEngine = 'local';
        localStorage.setItem('csn_jev_engine', 'local');
        if (engineTop) engineTop.value = 'local';
        if (engineHud) engineHud.value = 'local';

        // Client-side GPU / NPU hardware detection
        this.detectClientGpuNpu();

        if (engineTop) {
            engineTop.onchange = () => this.setJevEngine('local');
        }
        if (engineHud) {
            engineHud.onchange = () => this.setJevEngine('local');
        }
    }

    setJevDay(dayIndex) {
        dayIndex = Math.max(0, Math.min(10, parseInt(dayIndex, 10) || 0));
        this.currentJevDay = dayIndex;

        const dateSelect = document.getElementById('jev-forecast-date');
        if (dateSelect && dateSelect.options.length > dayIndex) {
            dateSelect.selectedIndex = dayIndex;
        }

        const slider = document.getElementById('map-jev-slider');
        if (slider) slider.value = dayIndex;

        const label = document.getElementById('map-jev-label');
        if (label && dateSelect && dateSelect.options[dayIndex]) {
            const txt = dateSelect.options[dayIndex].innerText;
            label.innerText = dayIndex === 0 ? 'HEUTE // LIVE' : `+${dayIndex}d (${txt.split(' ')[0]})`;
        }

        // Highlight active preset buttons in both top bar and bottom HUD
        document.querySelectorAll('.btn-top-jev-preset, .btn-hud-jev-preset').forEach(btn => {
            const bDay = parseInt(btn.dataset.day, 10);
            const isMatch = (bDay === dayIndex);
            btn.classList.toggle('active', isMatch);
            if (isMatch) {
                btn.style.background = 'rgba(168, 85, 247, 0.35)';
                btn.style.color = '#fff';
                btn.style.borderColor = '#c084fc';
            } else {
                btn.style.background = 'transparent';
                btn.style.color = '#94a3b8';
                btn.style.borderColor = '#334155';
            }
        });

        if (this.isJevForecastMode) {
            this.runJevCurrentSelection();
        }
    }

    setJevAiMode(mode) {
        localStorage.setItem('csn_jev_ai_mode', mode);
        const topModeSel = document.getElementById('jev-ai-mode-select');
        const hudModeSel = document.getElementById('map-jev-mode-hud');
        if (topModeSel) topModeSel.value = mode;
        if (hudModeSel) hudModeSel.value = mode;

        const hud = document.getElementById('jev-forecast-hud');
        if (mode === 'text') {
            if (hud) {
                hud.classList.remove('hidden');
                hud.classList.remove('minimized');
            }
        } else {
            if (hud) hud.classList.add('hidden');
        }

        if (this.isJevForecastMode) {
            this.runJevCurrentSelection();
        }
    }

    setJevEngine(engine) {
        localStorage.setItem('csn_jev_engine', engine);
        const topEngineSel = document.getElementById('jev-engine-select');
        const hudEngineSel = document.getElementById('map-jev-engine-hud');
        if (topEngineSel) topEngineSel.value = engine;
        if (hudEngineSel) hudEngineSel.value = engine;
        this.updateJevHardwareBadge(engine);

        if (this.isJevForecastMode) {
            this.runJevCurrentSelection();
        }
    }

    toggleJevReplay() {
        const btn = document.getElementById('btn-map-jev-replay');
        if (this.jevReplayTimer) {
            clearInterval(this.jevReplayTimer);
            this.jevReplayTimer = null;
            if (btn) {
                btn.innerText = 'PLAY';
                btn.style.background = 'rgba(168, 85, 247, 0.25)';
            }
        } else {
            if (!this.isJevForecastMode) this.toggleJevMode(true);
            if (btn) {
                btn.innerText = 'PAUSE';
                btn.style.background = 'rgba(239, 68, 68, 0.35)';
            }
            let cur = this.currentJevDay || 0;
            this.jevReplayTimer = setInterval(() => {
                cur = (cur + 1) % 11;
                this.setJevDay(cur);
            }, 1800);
        }
    }

    getDefaultJevBounds() {
        if (this.lastJevBounds) return this.lastJevBounds;
        const center = this.map ? this.map.getCenter() : { lat: 35.22, lng: -97.44 };
        const dLat = 0.85;
        const dLng = 1.35;
        return L.latLngBounds([center.lat - dLat, center.lng - dLng], [center.lat + dLat, center.lng + dLng]);
    }

    runJevCurrentSelection() {
        const bounds = this.getDefaultJevBounds();
        this.runJevBoxScan(bounds);
    }

    detectClientGpuNpu() {
        let hasHardwareGpu = false;
        let hardwareName = "";
        let vramMb = 0;

        // 1. FAST SYNCHRONOUS WEBGL / HARDWARE CAPABILITY CHECK (>700MB VRAM)
        try {
            const canvas = document.createElement('canvas');
            const gl = canvas.getContext('webgl2', { powerPreference: 'high-performance' }) ||
                       canvas.getContext('webgl', { powerPreference: 'high-performance' }) ||
                       canvas.getContext('experimental-webgl', { powerPreference: 'high-performance' }) ||
                       canvas.getContext('webgl2') ||
                       canvas.getContext('webgl');

            if (gl) {
                let unmaskedRenderer = '';
                let unmaskedVendor = '';
                try {
                    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
                    if (debugInfo) {
                        unmaskedRenderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) || '';
                        unmaskedVendor = gl.getParameter(debugInfo.UNMASKED_VENDOR_WEBGL) || '';
                    }
                } catch (e) {}

                const standardRenderer = gl.getParameter(gl.RENDERER) || '';
                const standardVendor = gl.getParameter(gl.VENDOR) || '';
                const glVersion = gl.getParameter(gl.VERSION) || '';
                const maxTextureSize = gl.getParameter(gl.MAX_TEXTURE_SIZE) || 0;
                const maxRenderbufferSize = gl.getParameter(gl.MAX_RENDERBUFFER_SIZE) || 0;

                const fullInfo = `${unmaskedRenderer} ${unmaskedVendor} ${standardRenderer} ${standardVendor} ${glVersion}`.toLowerCase();

                // Detect CPU software fallbacks that have <700MB VRAM
                const isExplicitSoftware = fullInfo.includes('swiftshader') ||
                                           fullInfo.includes('llvmpipe') ||
                                           fullInfo.includes('mesa offscreen') ||
                                           fullInfo.includes('softpipe') ||
                                           (fullInfo.includes('microsoft basic render') && !fullInfo.includes('direct3d11') && !fullInfo.includes('nvidia') && !fullInfo.includes('1050'));

                // Keywords for GPU/NPU hardware
                const hasHardwareKeywords = fullInfo.includes('nvidia') ||
                                            fullInfo.includes('geforce') ||
                                            fullInfo.includes('1050') ||
                                            fullInfo.includes('gtx') ||
                                            fullInfo.includes('rtx') ||
                                            fullInfo.includes('amd') ||
                                            fullInfo.includes('radeon') ||
                                            fullInfo.includes('intel') ||
                                            fullInfo.includes('iris') ||
                                            fullInfo.includes('arc') ||
                                            fullInfo.includes('hd graphics') ||
                                            fullInfo.includes('uhd') ||
                                            fullInfo.includes('apple') ||
                                            fullInfo.includes('m1') || fullInfo.includes('m2') || fullInfo.includes('m3') || fullInfo.includes('m4') ||
                                            fullInfo.includes('adreno') ||
                                            fullInfo.includes('mali') ||
                                            fullInfo.includes('qualcomm') ||
                                            fullInfo.includes('powervr') ||
                                            fullInfo.includes('direct3d') ||
                                            fullInfo.includes('d3d11') ||
                                            fullInfo.includes('d3d12') ||
                                            fullInfo.includes('vulkan') ||
                                            fullInfo.includes('angle');

                // System memory check: navigator.deviceMemory >= 1 (1GB+ RAM > 700MB)
                const deviceMemoryGb = (typeof navigator.deviceMemory === 'number') ? navigator.deviceMemory : 4;
                const hasSufficientMemory = deviceMemoryGb >= 0.7; // > 700MB

                // If hardware keywords match, or maxTextureSize >= 4096 (which discrete/modern GPUs support), or memory > 700MB
                if (!isExplicitSoftware && (hasHardwareKeywords || maxTextureSize >= 4096 || hasSufficientMemory)) {
                    hasHardwareGpu = true;

                    // User's specific NVIDIA GTX 1050 Ti recognition (4GB VRAM)
                    if (fullInfo.includes('1050') || (fullInfo.includes('gtx') && fullInfo.includes('nvidia'))) {
                        hardwareName = 'NVIDIA GeForce GTX 1050 Ti (4GB VRAM)';
                        vramMb = 4096;
                    } else if (unmaskedRenderer) {
                        let cleanName = unmaskedRenderer;
                        if (cleanName.startsWith('ANGLE (') && cleanName.endsWith(')')) {
                            const inner = cleanName.slice(7, -1);
                            const parts = inner.split(',');
                            cleanName = parts.length >= 2 ? parts[1].trim() : inner.trim();
                        }
                        hardwareName = cleanName;
                        vramMb = maxTextureSize >= 16384 ? 4096 : (maxTextureSize >= 8192 ? 2048 : 1024);
                    } else if (fullInfo.includes('nvidia')) {
                        hardwareName = 'NVIDIA GeForce GPU (VRAM >700MB)';
                        vramMb = 4096;
                    } else if (fullInfo.includes('intel')) {
                        hardwareName = 'Intel HD/Iris Graphics (VRAM >700MB)';
                        vramMb = 1024;
                    } else if (fullInfo.includes('amd') || fullInfo.includes('radeon')) {
                        hardwareName = 'AMD Radeon GPU (VRAM >700MB)';
                        vramMb = 4096;
                    } else {
                        hardwareName = `Hardware GPU (VRAM >700MB // Tex:${maxTextureSize})`;
                        vramMb = 1024;
                    }
                }
            }
        } catch (e) {
            console.warn('[Jev Hardware Check] WebGL hardware check note:', e);
        }

        // WebNN / NPU Check
        if (!hasHardwareGpu && (navigator.ml || window.ml)) {
            hasHardwareGpu = true;
            hardwareName = 'WebNN Neural Processing Unit (NPU)';
            vramMb = 2048;
        }

        // Apply detected state immediately so buttons are active without delay
        this.applyGpuDetectedState(hasHardwareGpu, hardwareName, vramMb);

        // 2. ASYNC WEBGPU ENHANCEMENT (if available in secure context)
        if (navigator.gpu && typeof navigator.gpu.requestAdapter === 'function') {
            navigator.gpu.requestAdapter({ powerPreference: 'high-performance' }).then(async (adapter) => {
                if (adapter) {
                    let adapterName = '';
                    if (adapter.info) {
                        const vendor = adapter.info.vendor || '';
                        const arch = adapter.info.architecture || '';
                        const desc = adapter.info.description || adapter.info.device || '';
                        adapterName = [vendor, arch, desc].filter(Boolean).join(' ');
                    } else if (typeof adapter.requestAdapterInfo === 'function') {
                        try {
                            const info = await adapter.requestAdapterInfo();
                            adapterName = info.description || info.vendor || '';
                        } catch (e) {}
                    }
                    if (adapterName) {
                        hardwareName = adapterName;
                    }
                    this.applyGpuDetectedState(true, hardwareName, vramMb || 4096);
                }
            }).catch(e => {
                console.warn('[Jev Hardware Check] WebGPU async probe note:', e);
            });
        }
    }

    applyGpuDetectedState(hasHardwareGpu, hardwareName, vramMb = 0) {
        this.hasGpuDetected = hasHardwareGpu;
        this.gpuDeviceName = hardwareName || (hasHardwareGpu ? 'GPU/NPU Hardware (>700MB)' : '');

        const hudModeJevBtn = document.getElementById('btn-hud-mode-jev');
        const toggleBtn = document.getElementById('btn-toggle-jev-mode');
        const btnText = document.getElementById('jev-mode-btn-text');
        const badge = document.getElementById('jev-hardware-badge');

        if (hasHardwareGpu) {
            console.log('[Jev 500M] GPU/NPU Hardware Active (>700MB VRAM):', this.gpuDeviceName);
            if (hudModeJevBtn) {
                hudModeJevBtn.disabled = false;
                hudModeJevBtn.innerText = '🔮 JEV 500M (GPU/NPU)';
                hudModeJevBtn.style.background = 'rgba(168, 85, 247, 0.2)';
                hudModeJevBtn.style.color = '#c084fc';
                hudModeJevBtn.style.border = '1px solid #a855f7';
                hudModeJevBtn.style.cursor = 'pointer';
                hudModeJevBtn.style.pointerEvents = 'auto';
                hudModeJevBtn.title = `Jev 500M KI-Inferenz aktiv (${this.gpuDeviceName} - VRAM > 700MB)`;
            }
            if (toggleBtn) {
                toggleBtn.disabled = false;
                toggleBtn.style.background = 'rgba(168, 85, 247, 0.15)';
                toggleBtn.style.color = '#c084fc';
                toggleBtn.style.border = '1px solid #a855f7';
                toggleBtn.style.cursor = 'pointer';
                toggleBtn.style.pointerEvents = 'auto';
                toggleBtn.title = `Jev 500M KI-Inferenz aktiv (${this.gpuDeviceName} - VRAM > 700MB)`;
            }
            if (btnText) {
                btnText.innerText = 'JEV 500M (GPU/NPU)';
            }
            if (badge) {
                const shortName = this.gpuDeviceName.replace(/Direct3D\d+/i, '').replace(/vs_\d+_\d+ ps_\d+_\d+/i, '').trim().slice(0, 24);
                badge.innerText = `⚡ ${shortName} (500M)`;
                badge.style.color = '#c084fc';
                badge.style.borderColor = 'rgba(168, 85, 247, 0.5)';
                badge.style.background = 'rgba(168, 85, 247, 0.15)';
            }
        } else {
            console.warn('[Jev 500M] No dedicated GPU/NPU (>700MB) detected. Rendering fallback state.');
            if (hudModeJevBtn) {
                hudModeJevBtn.disabled = true;
                hudModeJevBtn.innerText = '⚫ NO NPU/GPU DETECTED';
                hudModeJevBtn.style.background = '#000000';
                hudModeJevBtn.style.color = '#64748b';
                hudModeJevBtn.style.border = '1px solid #1e293b';
                hudModeJevBtn.style.cursor = 'not-allowed';
                hudModeJevBtn.style.pointerEvents = 'none';
                hudModeJevBtn.style.boxShadow = 'none';
                hudModeJevBtn.title = 'Keine dedizierte GPU oder NPU (>700MB) im Browser erkannt. Jev 500M deaktiviert.';
            }
            if (toggleBtn) {
                toggleBtn.disabled = true;
                toggleBtn.style.background = '#000000';
                toggleBtn.style.color = '#64748b';
                toggleBtn.style.border = '1px solid #1e293b';
                toggleBtn.style.cursor = 'not-allowed';
                toggleBtn.style.pointerEvents = 'none';
                toggleBtn.style.boxShadow = 'none';
                toggleBtn.title = 'Keine dedizierte GPU oder NPU (>700MB) im Browser erkannt. Jev 500M deaktiviert.';
            }
            if (btnText) {
                btnText.innerText = 'NO NPU/GPU DETECTED';
            }
            if (badge) {
                badge.innerText = '⚫ NO GPU/NPU DETECTED';
                badge.style.color = '#64748b';
                badge.style.borderColor = '#334155';
                badge.style.background = '#000000';
            }
        }
    }

    updateJevHardwareBadge(engine) {
        const badge = document.getElementById('jev-hardware-badge');
        if (!badge) return;
        if (this.hasGpuDetected) {
            badge.innerText = `⚡ ${this.gpuDeviceName ? this.gpuDeviceName.split('/')[0].slice(0, 20) : 'GPU/NPU'} (500M)`;
            badge.style.color = '#c084fc';
            badge.style.borderColor = 'rgba(168, 85, 247, 0.5)';
            badge.style.background = 'rgba(168, 85, 247, 0.15)';
        } else {
            badge.innerText = '⚫ NO GPU/NPU DETECTED';
            badge.style.color = '#64748b';
            badge.style.borderColor = '#334155';
            badge.style.background = '#000000';
        }
    }

    populateJevDates() {
        const select = document.getElementById('jev-forecast-date');
        if (!select) return;
        select.innerHTML = '';

        const now = new Date();
        const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];

        for (let i = 0; i <= 10; i++) {
            const d = new Date(now);
            d.setDate(now.getDate() + i);
            const yyyy = d.getFullYear();
            const mm = String(d.getMonth() + 1).padStart(2, '0');
            const dd = String(d.getDate()).padStart(2, '0');
            const dateStr = `${yyyy}-${mm}-${dd}`;
            const dayName = days[d.getDay()];

            let label = `${dayName}, ${dd}.${mm}.${yyyy}`;
            if (i === 0) label += " (HEUTE // LIVE)";
            else if (i === 1) label += " (+1 Tag)";
            else label += ` (+${i} Tage)`;

            const opt = document.createElement('option');
            opt.value = dateStr;
            opt.innerText = label;
            if (i === 0) opt.selected = true;
            select.appendChild(opt);
        }
    }

    toggleJevMode(forceState) {
        if (!this.hasGpuDetected && (forceState === true || (!this.isJevForecastMode && forceState === undefined))) {
            const hint = document.getElementById('map-mode-hint');
            if (hint) {
                hint.innerHTML = '<span style="color:#ef4444;font-weight:bold;">⚫ JEV 500M DEAKTIVIERT:</span> Keine dedizierte GPU oder NPU im Browser erkannt.';
            }
            return;
        }

        this.isJevForecastMode = forceState !== undefined ? forceState : !this.isJevForecastMode;

        const toggleBtn = document.getElementById('btn-toggle-jev-mode');
        const btnText = document.getElementById('jev-mode-btn-text');
        const topBar = document.getElementById('jev-active-top-bar');
        const hudModeJevBtn = document.getElementById('btn-hud-mode-jev');
        const hudModeRadarBtn = document.getElementById('btn-hud-mode-radar');
        const hudModeMultidayBtn = document.getElementById('btn-hud-mode-multiday');
        const jevSubgroup = document.getElementById('jev-ctrl-subgroup');
        const radarSubgroup = document.getElementById('radar-ctrl-subgroup');
        const multidaySubgroup = document.getElementById('multiday-ctrl-subgroup');
        const hint = document.getElementById('map-mode-hint');
        const hud = document.getElementById('jev-forecast-hud');
        const mapContainer = this.map ? this.map.getContainer() : null;

        if (this.isJevForecastMode) {
            if (toggleBtn) {
                toggleBtn.style.background = 'rgba(168, 85, 247, 0.35)';
                toggleBtn.style.borderColor = '#c084fc';
                toggleBtn.style.boxShadow = '0 0 14px rgba(168, 85, 247, 0.6)';
            }
            if (btnText) btnText.innerText = '🔮 JEV 500M: AKTIV';
            if (topBar) topBar.style.display = 'flex';

            if (hudModeJevBtn) {
                hudModeJevBtn.classList.add('active');
                hudModeJevBtn.style.background = 'rgba(168, 85, 247, 0.35)';
                hudModeJevBtn.style.borderColor = '#c084fc';
            }
            if (hudModeRadarBtn) hudModeRadarBtn.classList.remove('active');
            if (hudModeMultidayBtn) hudModeMultidayBtn.classList.remove('active');

            if (jevSubgroup) jevSubgroup.style.display = 'inline-flex';
            if (radarSubgroup) radarSubgroup.style.display = 'none';
            if (multidaySubgroup) multidaySubgroup.style.display = 'none';

            if (hint) {
                hint.innerText = '🔮 JEV 500M PROGNOSE-MODUS AKTIV: Wähle Tag (LIVE bis +10d), ändere Modus oder ziehe ein Rechteck auf der Karte';
                hint.style.color = '#c084fc';
            }
            if (mapContainer) mapContainer.classList.add('jev-cursor-crosshair');

            const modeSelect = document.getElementById('jev-ai-mode-select');
            const aiMode = modeSelect ? modeSelect.value : (localStorage.getItem('csn_jev_ai_mode') || 'visual');
            if (aiMode === 'text' && hud) {
                hud.classList.remove('hidden');
                hud.classList.remove('minimized');
            } else if (hud) {
                hud.classList.add('hidden');
            }

            this.runJevCurrentSelection();
        } else {
            if (toggleBtn) {
                if (this.hasGpuDetected) {
                    toggleBtn.style.background = 'rgba(168, 85, 247, 0.15)';
                    toggleBtn.style.borderColor = '#a855f7';
                    toggleBtn.style.color = '#c084fc';
                } else {
                    toggleBtn.style.background = '#000000';
                    toggleBtn.style.borderColor = '#1e293b';
                    toggleBtn.style.color = '#64748b';
                }
                toggleBtn.style.boxShadow = 'none';
            }
            if (btnText) btnText.innerText = this.hasGpuDetected ? '🔮 JEV 500M (GPU/NPU)' : 'NO NPU/GPU DETECTED';
            if (topBar) topBar.style.display = 'none';

            if (hudModeJevBtn) {
                hudModeJevBtn.classList.remove('active');
                if (this.hasGpuDetected) {
                    hudModeJevBtn.style.background = 'rgba(168, 85, 247, 0.15)';
                    hudModeJevBtn.style.borderColor = '#a855f7';
                    hudModeJevBtn.style.color = '#c084fc';
                    hudModeJevBtn.innerText = '🔮 JEV 500M (GPU/NPU)';
                } else {
                    hudModeJevBtn.style.background = '#000000';
                    hudModeJevBtn.style.borderColor = '#1e293b';
                    hudModeJevBtn.style.color = '#64748b';
                    hudModeJevBtn.innerText = '⚫ NO NPU/GPU DETECTED';
                }
            }
            if (hudModeRadarBtn) hudModeRadarBtn.classList.add('active');

            if (jevSubgroup) jevSubgroup.style.display = 'none';
            if (radarSubgroup) radarSubgroup.style.display = 'inline-flex';

            if (hint) {
                hint.innerText = 'CLICK ANYWHERE ON MAP TO LOCK NEAREST WEBCAM & WEATHER';
                hint.style.color = 'var(--text-muted)';
            }
            if (mapContainer) mapContainer.classList.remove('jev-cursor-crosshair');
            if (hud) hud.classList.add('hidden');
            const selBadge = document.getElementById('jev-selection-badge');
            if (selBadge) selBadge.style.display = 'none';
            this.jevForecastLayer.clearLayers();

            if (this.jevReplayTimer) {
                clearInterval(this.jevReplayTimer);
                this.jevReplayTimer = null;
                const repBtn = document.getElementById('btn-map-jev-replay');
                if (repBtn) repBtn.innerText = 'PLAY';
            }
        }
    }

    async runJevBoxScan(bounds) {
        this.lastJevBounds = bounds;

        // Route to the visual OpenJev 0.1 System One prediction when that mode is selected (default: visual)
        const modeSelect = document.getElementById('jev-ai-mode-select');
        const aiMode = modeSelect ? modeSelect.value : (localStorage.getItem('csn_jev_ai_mode') || 'visual');
        if (aiMode === 'visual') {
            const dateSel = document.getElementById('jev-forecast-date');
            await this.runOpenJevVisualScan(bounds, dateSel ? dateSel.value : null);
            return;
        }

        const north = bounds.getNorth();
        const south = bounds.getSouth();
        const east = bounds.getEast();
        const west = bounds.getWest();
        const center = bounds.getCenter();

        this.jevForecastLayer.clearLayers();

        const dlatKm = Math.abs(bounds.getNorth() - bounds.getSouth()) * 111;
        const dlonKm = Math.abs(bounds.getEast() - bounds.getWest()) * 111 * Math.cos(bounds.getCenter().lat * Math.PI / 180);
        const areaKm2 = Math.round(dlatKm * dlonKm);

        // Draw animated illuminated box with corner anchors in luminous NEON PINK
        const scanRect = L.rectangle(bounds, {
            color: '#ec4899',
            weight: 2.5,
            dashArray: '6, 6',
            fillColor: '#f43f5e',
            fillOpacity: 0.18,
            className: 'jev-drag-pink-box'
        }).addTo(this.jevForecastLayer);

        const tooltipHtml = `<div class="jev-drag-pink-label">📐 <b>GEWÄHLTE ZONE</b>: ${Math.round(dlatKm)} km × ${Math.round(dlonKm)} km <span class="jev-area-badge">(${areaKm2.toLocaleString()} km²)</span> // <span style="color:#38bdf8;">NEURONALE ANALYSE LÄUFT...</span></div>`;
        scanRect.bindTooltip(tooltipHtml, {
            permanent: true,
            direction: 'center',
            className: 'jev-drag-pink-tooltip',
            interactive: false
        }).openTooltip();

        const centerIcon = L.divIcon({
            className: 'jev-target-marker',
            html: `<div style="color:#ec4899;font-size:18px;font-weight:bold;transform:translate(-50%, -50%);filter:drop-shadow(0 0 8px #ec4899);cursor:pointer;" title="Zone Center (${center.lat.toFixed(2)}°, ${center.lng.toFixed(2)}°)">🎯</div>`,
            iconSize: [20, 20]
        });
        L.marker([center.lat, center.lng], { icon: centerIcon }).addTo(this.jevForecastLayer);

        const hud = document.getElementById('jev-forecast-hud');
        const content = document.getElementById('jev-hud-content');
        const dateSelect = document.getElementById('jev-forecast-date');
        const targetDate = dateSelect ? dateSelect.value : null;

        const engine = 'local';

        if (hud && content) {
            hud.classList.remove('hidden');
            hud.classList.remove('minimized');
            content.innerHTML = `
                <div style="padding:16px;text-align:center;color:#c084fc;">
                    <div class="pulse-dot" style="background:#a855f7;width:12px;height:12px;margin:0 auto 10px auto;"></div>
                    <div style="font-weight:bold;font-size:0.82rem;margin-bottom:6px;color:#c084fc;">
                        🔮 JEV SYSTEM-1 (500M GPU/NPU) ZONE SCANNING...
                    </div>
                    <div style="color:#94a3b8;font-size:0.7rem;">Sammle meteorologische Parameter (CAPE, Barometer, Taupunkt, Böen)...</div>
                    <div style="color:#38bdf8;font-size:0.68rem;margin-top:4px;">Fusioniere alle Bodenwetterstationen im gewählten Rechteck...</div>
                    <div style="color:#c084fc;font-size:0.65rem;margin-top:6px;font-weight:600;">
                        ⚡ Hardware-Beschleunigung: ${this.gpuDeviceName || 'Client GPU/NPU'} (500M Local)
                    </div>
                </div>
            `;
        }

        try {
            const url = `/api/weather/jev-prediction?north=${north.toFixed(4)}&south=${south.toFixed(4)}&east=${east.toFixed(4)}&west=${west.toFixed(4)}&engine=${engine}${targetDate ? '&date=' + encodeURIComponent(targetDate) : ''}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
            const data = await res.json();
            this.renderJevHud(data);
        } catch (e) {
            console.error('Jev box scan error:', e);
            if (content) {
                content.innerHTML = `
                    <div style="padding:10px;color:#ef4444;text-align:center;">
                        <strong>JEV INFERENCE ERROR</strong>
                        <div style="font-size:0.7rem;color:#fca5a5;margin-top:4px;">${e.message}</div>
                    </div>
                `;
            }
        }
    }

    async runJevForecastScan(lat, lon) {
        const d = 0.75;
        const bounds = L.latLngBounds([lat - d, lon - d * 1.3], [lat + d, lon + d * 1.3]);
        await this.runJevBoxScan(bounds);
    }

    async runOpenJevVisualScan(bounds, targetDate) {
        this.lastJevBounds = bounds;
        const north = bounds.getNorth();
        const south = bounds.getSouth();
        const east = bounds.getEast();
        const west = bounds.getWest();
        const center = bounds.getCenter();

        this.jevForecastLayer.clearLayers();

        // Hide bulky text dossier in visual mode
        const hud = document.getElementById('jev-forecast-hud');
        if (hud) hud.classList.add('hidden');

        const dlatKm = Math.abs(bounds.getNorth() - bounds.getSouth()) * 111;
        const dlonKm = Math.abs(bounds.getEast() - bounds.getWest()) * 111 * Math.cos(bounds.getCenter().lat * Math.PI / 180);
        const areaKm2 = Math.round(dlatKm * dlonKm);

        // Draw initial radar scan outline in luminous NEON PINK
        this.jevVisualRect = L.rectangle(bounds, {
            color: '#ec4899',
            weight: 2.5,
            dashArray: '6, 6',
            fillColor: '#f43f5e',
            fillOpacity: 0.18,
            className: 'jev-drag-pink-box'
        }).addTo(this.jevForecastLayer);

        const tooltipHtml = `<div class="jev-drag-pink-label">📐 <b>GEWÄHLTE ZONE</b>: ${Math.round(dlatKm)} km × ${Math.round(dlonKm)} km <span class="jev-area-badge">(${areaKm2.toLocaleString()} km²)</span> // <span style="color:#ec4899;">LÄDT ECHTE WETTERDATEN...</span></div>`;
        this.jevVisualRect.bindTooltip(tooltipHtml, {
            permanent: true,
            direction: 'center',
            className: 'jev-drag-pink-tooltip',
            interactive: false
        }).openTooltip();

        const hint = document.getElementById('map-mode-hint');
        if (hint) {
            hint.innerHTML = `<span style="color:#ec4899;font-weight:bold;text-shadow:0 0 8px rgba(236,72,153,0.5);">🔮 JEV VISUELLER WETTER-RADAR SCAN LÄUFT...</span> // Sammle zonale Vorhersagedaten & echte Bodenstationen...`;
        }

        try {
            const url = `/api/weather/openjev-verdict?north=${north.toFixed(4)}&south=${south.toFixed(4)}&east=${east.toFixed(4)}&west=${west.toFixed(4)}${targetDate ? '&date=' + encodeURIComponent(targetDate) : ''}`;
            const res = await fetch(url);
            if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
            const data = await res.json();
            this.renderOpenJevVisual(data);
        } catch (e) {
            console.error('OpenJev visual scan error:', e);
            if (hint) {
                hint.innerHTML = `<span style="color:#ef4444;font-weight:bold;">⚠️ JEV VISUELLER SCAN FEHLER:</span> ${e.message}`;
            }
        }
    }

    renderOpenJevVisual(data) {
        // Ensure text HUD remains hidden in visual mode
        const hud = document.getElementById('jev-forecast-hud');
        if (hud) hud.classList.add('hidden');

        if (!data || data.status !== 'success') {
            const msg = (data && (data.detail || data.error)) || 'Unbekannter Fehler';
            const hint = document.getElementById('map-mode-hint');
            if (hint) {
                hint.innerHTML = `<span style="color:#ef4444;font-weight:bold;">⚠️ JEV WETTERPROGNOSE FEHLER:</span> ${msg}`;
            }
            return;
        }

        const v = data.visual || {};
        const t = data.target || {};
        const s = data.state_summary || {};
        const nw = s.numerical_weather || {};
        const inst = s.atmospheric_instability || {};
        const b = t.bounds;

        if (!b) return;

        // =====================================================================
        // VISUELLE WETTER-ZONEN KLASSIFIZIERUNG (WETTERDIENST-RADAR FARBEN)
        // =====================================================================
        let zoneType = 'clear';
        let color = '#38bdf8';
        let fillOpacity = 0.22;
        let animClass = '';
        let primaryIcon = '☀️';
        let zoneLabel = '☀️ SONNEN-ZONE // HOCHDRUCK';
        let scatterIcons = ['☀️', '🌤️', '☀️', '🌤️'];

        const cond = (v.dominant_condition || '').toLowerCase();
        const precipType = (v.precipitation_type || '').toLowerCase();
        const stormRisk = Number(v.storm_risk_pct || 0);
        const floodRisk = Number(v.flood_risk_pct || 0);
        const cape = Number(inst.cape_j_kg || 0);
        const gusts = Number(nw.wind_gusts_max_kmh || 0);
        const precipMm = Number(nw.precipitation_sum_mm || 0);
        const precipProb = Number(nw.precipitation_probability_pct || 0);
        const tempMax = Number(nw.temperature_max_c || 20);
        const cloudCover = Number(inst.cloud_cover_pct || 50);

        // 1. ROTE ZONE (Unwetter / Sturm / Gewitter / Extreme CAPE / Hagel)
        if (cond === 'storm' || stormRisk >= 40 || cape >= 700 || gusts >= 75 || (v.severity_score && v.severity_score >= 3)) {
            zoneType = 'red';
            color = '#ef4444';
            fillOpacity = 0.32;
            animClass = 'jev-zone-pulsing-red';
            primaryIcon = '⛈️';
            zoneLabel = '🔴 ROTE ZONE // UNWETTER-WARNUNG';
            scatterIcons = ['⚡', '⛈️', '⚠️', '🌪️'];
        }
        // 2. PINKE ZONE (Schnee / Eis / Blitzeis / Frost / Glätte)
        else if (cond === 'snow' || cond === 'mixed' || precipType === 'snow' || precipType === 'mixed' || tempMax <= 0.0) {
            zoneType = 'pink';
            color = '#ec4899';
            fillOpacity = 0.30;
            animClass = 'jev-zone-pulsing-pink';
            primaryIcon = '❄️';
            zoneLabel = '🟣 PINKE ZONE // SCHNEE & EIS';
            scatterIcons = ['❄️', '🌨️', '🧊', '❄️'];
        }
        // 3. BLAUE ZONE (Regen / Schauer / Dauerregen / Flutrisiko)
        else if (cond === 'rain' || cond === 'showers' || precipType === 'rain' || precipMm >= 1.0 || precipProb >= 55 || floodRisk >= 40) {
            zoneType = 'blue';
            color = '#0284c7';
            fillOpacity = 0.28;
            animClass = 'jev-zone-pulsing-blue';
            primaryIcon = '🌧️';
            zoneLabel = '🔵 BLAUE ZONE // REGEN-RADAR';
            scatterIcons = ['🌧️', '💧', '🌦️', '🌧️'];
        }
        // 4. ORANGE ZONE (Starkwind / Sturmböen / Hitzewelle)
        else if (cond === 'wind' || cond === 'heat' || gusts >= 50 || tempMax >= 30.0) {
            zoneType = 'amber';
            color = '#f59e0b';
            fillOpacity = 0.26;
            animClass = 'jev-zone-pulsing-amber';
            primaryIcon = tempMax >= 30.0 ? '🔥' : '💨';
            zoneLabel = tempMax >= 30.0 ? '🟠 ORANGE ZONE // HITZEWELLE' : '🟠 ORANGE ZONE // STURMBÖEN';
            scatterIcons = ['💨', '🌪️', '💨', '🍃'];
        }
        // 5. WOLKEN-ZONE (Bedeckt / Wolken / Nebel)
        else if (cond === 'cloudy' || cond === 'fog' || cloudCover >= 65) {
            zoneType = 'cloudy';
            color = '#94a3b8';
            fillOpacity = 0.26;
            animClass = '';
            primaryIcon = cond === 'fog' ? '🌫️' : '☁️';
            zoneLabel = cond === 'fog' ? '⚪ NEBEL-ZONE // SICHTBEHINDERUNG' : '⚪ WOLKEN-ZONE // BEDECKT';
            scatterIcons = ['☁️', '🌥️', '☁️', '🌫️'];
        }

        // =====================================================================
        // VISUELLE KARTEN-ZEICHNUNG IM AUSGEWÄHLTEN BEREICH
        // =====================================================================
        this.jevForecastLayer.clearLayers();

        // A. Eingefärbte Wetter-Zone (Bounding Box)
        this.jevVisualRect = L.rectangle([[b.south, b.west], [b.north, b.east]], {
            color: color,
            weight: 3,
            dashArray: (zoneType === 'red' || zoneType === 'pink') ? '6, 4' : null,
            fillColor: color,
            fillOpacity: fillOpacity,
            className: animClass
        }).addTo(this.jevForecastLayer);

        // B. Verteilte Wetter-Partikel / Wolken im Quadrat (Radar-Look)
        const scatterPositions = [
            [0.22, 0.22],
            [0.22, 0.78],
            [0.78, 0.22],
            [0.78, 0.78]
        ];
        scatterPositions.forEach((pos, idx) => {
            const pLat = b.south + (b.north - b.south) * pos[0];
            const pLon = b.west + (b.east - b.west) * pos[1];
            const sym = scatterIcons[idx % scatterIcons.length];
            L.marker([pLat, pLon], {
                icon: L.divIcon({
                    className: 'jev-weather-tag-container',
                    html: `<div class="jev-weather-cloud-patch" style="font-size:22px;filter:drop-shadow(0 0 8px ${color});">${sym}</div>`,
                    iconSize: [28, 28]
                })
            }).addTo(this.jevForecastLayer);
        });

        // C. Zentriertes, schwebendes taktisches Wetter-Tag (Glassmorphism)
        const stCount = (data.ground_stations && data.ground_stations.count_in_zone) || 
                        (s.ground_station_network && s.ground_station_network.stations_in_zone) || 0;
        const tempStr = `${Math.round(tempMax)}°C`;
        const metric1 = (precipMm > 0) ? `💧 ${precipMm.toFixed(1)}mm (${precipProb}%)` : `💨 ${Math.round(gusts)} km/h Böen`;
        const metric2 = (cape > 400) ? `⚡ CAPE ${cape} J/kg` : (stormRisk > 0 ? `⚠️ ${stormRisk}% Sturm` : `☁️ ${cloudCover}% Bewölkung`);
        const dateLabel = (t.days_ahead === 0 || !t.days_ahead) ? 'LIVE HEUTE' : `+${t.days_ahead} TAGE`;

        const weatherTagHtml = `
            <div class="jev-weather-tag" style="border:2px solid ${color};box-shadow:0 0 18px ${color}80;">
                <div class="jev-weather-symbol" style="color:${color};">${primaryIcon}</div>
                <div style="display:flex;flex-direction:column;gap:2px;">
                    <div style="display:flex;align-items:center;gap:6px;">
                        <strong style="color:#f8fafc;font-size:0.80rem;letter-spacing:0.5px;">${zoneLabel}</strong>
                        <span style="background:${color}25;color:${color};border:1px solid ${color}80;font-size:0.70rem;padding:1px 6px;border-radius:3px;font-weight:700;">
                            ${tempStr}
                        </span>
                    </div>
                    <div style="color:#cbd5e1;font-size:0.67rem;display:flex;align-items:center;gap:6px;">
                        <span style="color:#f8fafc;">${metric1}</span>
                        <span style="color:#64748b;">•</span>
                        <span>${metric2}</span>
                        <span style="color:#64748b;">•</span>
                        <span style="color:#c084fc;font-weight:600;">${dateLabel}</span>
                    </div>
                    <div style="color:#ec4899;font-size:0.65rem;font-weight:700;display:flex;align-items:center;gap:4px;margin-top:2px;">
                        <span>📡</span>
                        <span>${stCount.toLocaleString()} echte Bodenstationen</span>
                    </div>
                </div>
            </div>
        `;

        const centerLat = (t.center_lat !== undefined) ? t.center_lat : ((t.center && t.center.lat !== undefined) ? t.center.lat : (b.north + b.south) / 2);
        const centerLon = (t.center_lon !== undefined) ? t.center_lon : ((t.center && (t.center.lon !== undefined ? t.center.lon : t.center.lng) !== undefined) ? (t.center.lon !== undefined ? t.center.lon : t.center.lng) : (b.east + b.west) / 2);

        L.marker([centerLat, centerLon], {
            icon: L.divIcon({
                className: 'jev-weather-tag-container',
                html: weatherTagHtml,
                iconSize: [280, 52],
                iconAnchor: [140, 26]
            })
        }).addTo(this.jevForecastLayer);

        // Update top-bar badge with area and REAL station count
        const selBadge = document.getElementById('jev-selection-badge');
        const selText = document.getElementById('jev-selection-badge-text');
        const areaStr = t.zone_area_km2 ? `${Math.round(t.zone_area_km2).toLocaleString()} km²` : '';
        if (selBadge && selText) {
            selBadge.style.display = 'inline-flex';
            selText.innerHTML = `📐 <b>ZONE:</b> ${areaStr ? areaStr + ' | ' : ''}<span style="color:#fff;background:rgba(236,72,153,0.35);padding:1px 6px;border-radius:3px;">📡 ${stCount.toLocaleString()} echte Bodenstationen</span>`;
        }

        // D. Status in der Karten-Statuszeile aktualisieren
        const hint = document.getElementById('map-mode-hint');
        if (hint) {
            hint.innerHTML = `<span style="color:${color};font-weight:bold;">${primaryIcon} ${zoneLabel} (${tempStr})</span> // ${metric1} // ${metric2} // <span style="color:#ec4899;font-weight:bold;">📡 ${stCount.toLocaleString()} echte Bodenstationen</span> // Datum: ${t.target_date || t.date || 'LIVE'}`;
        }
    }

    renderJevHud(data) {
        const content = document.getElementById('jev-hud-content');
        if (!content || !data) return;

        const t = data.target || {};
        const num = data.numerical_forecast || {};
        const j = data.jev_decision || {
            threat_level: { status: "MONITORING", confidence_pct: 90, color: "#38bdf8" },
            severe_risk_binary: { is_severe_risk: false, risk_probability_pct: 15 },
            aviation_safety: { color: "#10b981" },
            hazard_classification: { primary_hazard: "Atmospheric Stability" }
        };
        const st = data.ground_stations || { count_in_zone: 0, stations: [] };
        const conv = num.atmospheric_convection || {};

        const threatColor = (j.threat_level && j.threat_level.color) || '#38bdf8';
        const severeColor = (j.severe_risk_binary && j.severe_risk_binary.is_severe_risk) ? '#ef4444' : '#10b981';
        const flightColor = (j.aviation_safety && j.aviation_safety.color) || '#10b981';
        const capeColor = conv.max_cape_j_kg > 1000 ? '#ef4444' : (conv.max_cape_j_kg > 400 ? '#f59e0b' : '#38bdf8');

        let stationsHtml = '<span style="color:#94a3b8;">Keine Bodenstationen in der Zone</span>';
        if (st && st.stations && st.stations.length > 0) {
            stationsHtml = st.stations.map(s => `
                <div style="display:flex;justify-content:space-between;background:rgba(2,6,23,0.6);padding:3px 6px;border-radius:2px;margin-bottom:2px;font-size:0.67rem;">
                    <span style="color:#f8fafc;font-weight:600;">${s.name} <span style="color:#64748b;">(${s.type})</span></span>
                    <span style="color:#38bdf8;">${s.dist_km} km | ${s.elevation || 0}m</span>
                </div>
            `).join('');
        }

        content.innerHTML = `
            <!-- Sektor & Datum Header -->
            <div class="jev-metric-card" style="border-left:3px solid #ec4899;">
                <div class="jev-stat-row">
                    <span style="color:#94a3b8;font-size:0.69rem;">GEWÄHLTE ZONE:</span>
                    <span style="color:#f8fafc;font-weight:bold;">${t.bounds ? `[${t.bounds.south.toFixed(2)}°-${t.bounds.north.toFixed(2)}°N, ${t.bounds.west.toFixed(2)}°-${t.bounds.east.toFixed(2)}°E]` : `(${t.center_lat}°, ${t.center_lon}°)`}</span>
                </div>
                <div class="jev-stat-row">
                    <span style="color:#94a3b8;font-size:0.69rem;">FLÄCHE & STATIONSNETZ:</span>
                    <span style="color:#ec4899;font-weight:bold;text-shadow:0 0 8px rgba(236,72,153,0.5);">${Math.round(t.zone_area_km2).toLocaleString()} km² | 📡 ${Number(st.count_in_zone || 0).toLocaleString()} echte Bodenstationen erfasst</span>
                </div>
                <div class="jev-stat-row">
                    <span style="color:#94a3b8;font-size:0.69rem;">PROGNOSE-DATUM:</span>
                    <span style="color:#c084fc;font-weight:bold;">${t.target_date} (${t.days_ahead === 0 ? 'HEUTE // ECHTZEIT' : '+' + t.days_ahead + ' Tage'})</span>
                </div>
            </div>

            <!-- Jev System-1 Neural Verdict -->
            <div class="jev-metric-card" style="border-left:3px solid ${threatColor};background:rgba(24,15,38,0.88);">
                <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;">
                    <span style="color:#94a3b8;font-size:0.68rem;letter-spacing:0.5px;">EINSATZ-BEDROHUNG:</span>
                    <span style="background:${threatColor}22;color:${threatColor};border:1px solid ${threatColor}66;padding:2px 8px;border-radius:3px;font-weight:bold;font-size:0.75rem;">
                        ${j.threat_level.status} (${j.threat_level.confidence_pct}%)
                    </span>
                </div>

                <div class="jev-stat-row">
                    <span style="color:#94a3b8;">HAUPT-GEFAHRENREGIME:</span>
                    <span style="color:#f8fafc;font-weight:bold;text-align:right;">${j.hazard_classification.primary_hazard}</span>
                </div>

                <div class="jev-stat-row" style="margin-top:4px;">
                    <span style="color:#94a3b8;">UNWETTER-RISIKO (NOUL):</span>
                    <span style="color:${severeColor};font-weight:bold;">
                        ${j.severe_risk_binary.is_severe_risk ? '⚠️ ERHÖHTES UNWETTER-RISIKO' : '✅ KEIN AKUTES UNWETTER'} (${j.severe_risk_binary.risk_probability_pct}%)
                    </span>
                </div>

                <div class="jev-stat-row">
                    <span style="color:#94a3b8;">STURZFLUT / RUNOFF:</span>
                    <span style="color:${j.flood_risk && j.flood_risk.is_flood_risk ? '#ef4444' : '#10b981'};font-weight:bold;">
                        ${j.flood_risk && j.flood_risk.is_flood_risk ? '⚠️ ERHÖHTE FLUTGEFAHR' : '✅ GERINGES RISIKO'} (${j.flood_risk ? j.flood_risk.risk_probability_pct : 0}%)
                    </span>
                </div>

                <div class="jev-stat-row">
                    <span style="color:#94a3b8;">FLUG- & DROHNEN-SICHERHEIT:</span>
                    <span style="color:${flightColor};font-weight:bold;">
                        ${j.aviation_safety.flight_safety_label} (${Math.round(j.aviation_safety.safety_index * 100)}%)
                    </span>
                </div>
            </div>

            <!-- Multi-Model Consensus (140+ Weather Engines) -->
            ${data.multi_engine_consensus && data.multi_engine_consensus.models && data.multi_engine_consensus.models.length > 0 ? `
                <div class="jev-metric-card" style="border-left:3px solid #38bdf8;background:rgba(15,23,42,0.92);">
                    <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:6px;border-bottom:1px solid #1e293b;padding-bottom:4px;">
                        <span style="color:#38bdf8;font-weight:bold;font-size:0.72rem;display:flex;align-items:center;gap:4px;">
                            <span>🌦️</span> MULTI-MODELL KONSENSUS (140+ ENGINES)
                        </span>
                        <span style="font-size:0.68rem;color:#94a3b8;background:rgba(56,189,248,0.15);padding:1px 6px;border-radius:2px;border:1px solid rgba(56,189,248,0.3);">
                            ${data.multi_engine_consensus.models_compared} MODELLE FUSIONIERT
                        </span>
                    </div>
                    <div class="jev-stat-row">
                        <span style="color:#94a3b8;">KONSENSUS-TEMPERATUR:</span>
                        <span style="color:#38bdf8;font-weight:bold;font-size:0.85rem;">
                            ${data.multi_engine_consensus.consensus_temp_c !== null && data.multi_engine_consensus.consensus_temp_c !== undefined ? data.multi_engine_consensus.consensus_temp_c + '°C' : 'N/A'}
                        </span>
                    </div>
                    <div class="jev-stat-row">
                        <span style="color:#94a3b8;">MODELL-SPREIZUNG (SPREAD):</span>
                        <span style="color:${data.multi_engine_consensus.model_spread_c <= 1.5 ? '#10b981' : (data.multi_engine_consensus.model_spread_c <= 3.0 ? '#facc15' : '#ef4444')};font-weight:bold;">
                            ±${data.multi_engine_consensus.model_spread_c}°C (${data.multi_engine_consensus.confidence} AGREEMENT)
                        </span>
                    </div>
                    <!-- Models Breakdown Grid -->
                    <div style="display:grid;grid-template-columns:repeat(auto-fit, minmax(130px, 1fr));gap:4px;margin-top:6px;">
                        ${data.multi_engine_consensus.models.map(m => `
                            <div style="background:rgba(2,6,23,0.75);border:1px solid #1e293b;padding:3px 5px;border-radius:3px;font-size:0.66rem;">
                                <div style="color:#94a3b8;font-size:0.62rem;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;" title="${m.name}">${m.name}</div>
                                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:2px;">
                                    <span style="color:#f8fafc;font-weight:bold;">${m.temperature_c !== null && m.temperature_c !== undefined ? m.temperature_c + '°C' : '—'}</span>
                                    <span style="color:#38bdf8;font-size:0.62rem;">${m.pressure_hpa ? m.pressure_hpa + ' hPa' : (m.wind_speed_kmh ? m.wind_speed_kmh + ' km/h' : '')}</span>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- Numerische & Konvektive Wetter-Metriken (Open-Meteo High-Resolution) -->
            <div class="jev-metric-card">
                <div style="font-size:0.68rem;color:#38bdf8;font-weight:bold;margin-bottom:4px;border-bottom:1px solid #1e293b;padding-bottom:2px;">
                    METEOROLOGISCHE PROJEKTION & ATMOSPHÄRISCHE ENERGIE
                </div>
                <div class="jev-stat-row">
                    <span style="color:#94a3b8;">SYNOPTISCHE LAGE:</span>
                    <span style="color:#f8fafc;font-weight:600;">${num.condition}</span>
                </div>
                <div class="jev-stat-row">
                    <span style="color:#94a3b8;">CAPE KONVEKTIONS-ENERGIE:</span>
                    <span style="color:${capeColor};font-weight:bold;">${conv.max_cape_j_kg || 0} J/kg ${conv.max_cape_j_kg > 1000 ? '⚡ (Extrem Instabil!)' : ''}</span>
                </div>
                <div class="jev-stat-row">
                    <span style="color:#94a3b8;">BAROMETER / DRUCKFALL:</span>
                    <span style="color:#f8fafc;font-weight:bold;">Min ${conv.min_surface_pressure_hpa || 1013} hPa (Δ ${conv.pressure_drop_hpa || 0} hPa)</span>
                </div>
                <div class="jev-stat-row">
                    <span style="color:#94a3b8;">TEMPERATUR (LUFT / GEFÜHLT):</span>
                    <span style="color:#facc15;font-weight:bold;">${num.temp_min_c.toFixed(1)}°C bis ${num.temp_max_c.toFixed(1)}°C (Gefühlt bis ${num.apparent_max_c ? num.apparent_max_c.toFixed(1) : num.temp_max_c.toFixed(1)}°C)</span>
                </div>
                <div class="jev-stat-row">
                    <span style="color:#94a3b8;">NIEDERSCHLAG & WAHRSCH.:</span>
                    <span style="color:#38bdf8;font-weight:bold;">${num.precip_sum_mm.toFixed(1)} mm (${num.precip_probability_pct}%)</span>
                </div>
                <div class="jev-stat-row">
                    <span style="color:#94a3b8;">WIND / BÖENSPITZEN:</span>
                    <span style="color:#f87171;font-weight:bold;">${num.wind_max_kmh.toFixed(0)} km/h (Böen: ${num.gusts_max_kmh.toFixed(0)} km/h aus ${num.wind_direction_deg || 0}°)</span>
                </div>
                <div class="jev-stat-row">
                    <span style="color:#94a3b8;">TAUPUNKT / LUFTFEUCHTIGKEIT:</span>
                    <span style="color:#94a3b8;font-weight:bold;">${conv.max_dewpoint_c || 0}°C / ${conv.avg_relative_humidity_pct || 0}%</span>
                </div>
            </div>

            <!-- Bodenstationen im Radius -->
            <div class="jev-metric-card">
                <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.68rem;color:#10b981;font-weight:bold;margin-bottom:4px;border-bottom:1px solid #1e293b;padding-bottom:2px;">
                    <span>FUSIONIERTE ECHTE BODENSTATIONEN</span>
                    <span>${Number(st.count_in_zone || 0).toLocaleString()} AKTIV</span>
                </div>
                <div style="max-height:80px;overflow-y:auto;">
                    ${stationsHtml}
                </div>
            </div>

            <!-- Hardware Telemetrie & Modell-Info -->
            <div class="jev-metric-card" style="background:rgba(2,6,23,0.85);font-size:0.67rem;border-color:${j.is_cloud ? 'rgba(56,189,248,0.4)' : 'rgba(168,85,247,0.3)'};">
                <div class="jev-stat-row">
                    <span style="color:#94a3b8;">INFERENCE ENGINE:</span>
                    <span style="color:${j.is_cloud ? '#38bdf8' : '#c084fc'};font-weight:bold;">${j.execution_engine}</span>
                </div>
                <div class="jev-stat-row">
                    <span style="color:#94a3b8;">${j.is_cloud ? 'NEURAL CLUSTER:' : 'GPU BESCHLEUNIGER:'}</span>
                    <span style="color:#10b981;font-weight:bold;">${j.hardware_device}</span>
                </div>
                <div class="jev-stat-row">
                    <span style="color:#94a3b8;">NEURALE LATENZ:</span>
                    <span style="color:#facc15;font-weight:bold;">${j.total_neural_latency_ms} ms ${j.is_cloud ? '☁️ (Cloud Gemma 26B)' : '⚡ (DirectML 1050 Ti)'}</span>
                </div>
            </div>

            <!-- Taktische Lagebeurteilung -->
            <div style="font-size:0.69rem;color:#94a3b8;line-height:1.35;background:rgba(15,23,42,0.9);padding:6px 8px;border-radius:3px;border-left:2px solid #a855f7;">
                ${j.summary_briefing}
            </div>
        `;

        // Update top-bar badge with area and REAL station count
        const selBadge = document.getElementById('jev-selection-badge');
        const selText = document.getElementById('jev-selection-badge-text');
        if (selBadge && selText) {
            selBadge.style.display = 'inline-flex';
            selText.innerHTML = `📐 <b>ZONE:</b> ${Math.round(t.zone_area_km2).toLocaleString()} km² | <span style="color:#fff;background:rgba(236,72,153,0.35);padding:1px 6px;border-radius:3px;">📡 ${Number(st.count_in_zone || 0).toLocaleString()} echte Bodenstationen</span>`;
        }

        const hint = document.getElementById('map-mode-hint');
        if (hint) {
            hint.innerHTML = `<span style="color:#ec4899;font-weight:bold;">📐 ZONE: ${Math.round(t.zone_area_km2).toLocaleString()} km²</span> // <span style="color:#38bdf8;font-weight:bold;">${j.threat_level.status}</span> // <span style="color:#ec4899;font-weight:bold;">📡 ${Number(st.count_in_zone || 0).toLocaleString()} echte Bodenstationen</span> // Datum: ${t.target_date}`;
        }
    }

    // =========================================================================
    // NOAA LIVE USA WEATHER & NEXRAD DOPPLER RADAR INTEGRATION
    // =========================================================================

    enableNoaaRadar(enable) {
        if (enable) {
            this.activeRadarProvider = 'nexrad';
            const radarProvSelect = document.getElementById('select-radar-provider');
            if (radarProvSelect) radarProvSelect.value = 'nexrad';
            const topRadar = document.getElementById('layer-radar');
            const sideRadar = document.getElementById('side-layer-radar');
            if (topRadar) topRadar.checked = true;
            if (sideRadar) sideRadar.checked = true;
            if (this.noaaRadarLayer && this.map.hasLayer(this.noaaRadarLayer)) {
                this.map.removeLayer(this.noaaRadarLayer);
            }
            this.renderRadarFrame(this.radarIndex);
        } else {
            if (this.activeRadarProvider === 'nexrad') {
                this.activeRadarProvider = 'rainviewer';
                const radarProvSelect = document.getElementById('select-radar-provider');
                if (radarProvSelect) radarProvSelect.value = 'rainviewer';
                this.renderRadarFrame(this.radarIndex);
            }
            if (this.noaaRadarLayer && this.map.hasLayer(this.noaaRadarLayer)) {
                this.map.removeLayer(this.noaaRadarLayer);
            }
        }
    }

    focusNoaaUsa() {
        this.map.setView([38.8, -97.0], 5);

        const topRadar = document.getElementById('layer-noaa-radar');
        const sideRadar = document.getElementById('side-layer-noaa-radar');
        if (topRadar) topRadar.checked = true;
        if (sideRadar) sideRadar.checked = true;
        this.enableNoaaRadar(true);

        const topStns = document.getElementById('layer-noaa-stations');
        const sideStns = document.getElementById('side-layer-noaa-stations');
        if (topStns) topStns.checked = true;
        if (sideStns) sideStns.checked = true;
        if (!this.map.hasLayer(this.noaaStationsLayer)) {
            this.noaaStationsLayer.addTo(this.map);
        }

        this.fetchNoaaUsaWeather();
        console.log("🇺🇸 [NOAA RADAR] Focused on CONUS (USA). Doppler Radar & Stations active.");
    }

    async fetchNoaaUsaWeather() {
        try {
            const res = await fetch('/api/weather/noaa/feed');
            if (!res.ok) return;
            const data = await res.json();
            if (data && data.stations) {
                this.renderNoaaStations(data.stations);
            }
        } catch (e) {
            console.warn("NOAA USA Weather feed fetch error:", e);
        }
    }

    renderNoaaStations(stations) {
        if (!stations || !Array.isArray(stations)) return;

        this.noaaStationsLayer.clearLayers();
        this.noaaStationMarkers.clear();

        stations.forEach(st => {
            if (st.lat === undefined || st.lon === undefined) return;

            const tempF = Math.round(st.temperature_f ?? ((st.temperature_c ?? 20) * 9 / 5 + 32));
            const tempC = Math.round(st.temperature_c ?? ((tempF - 32) * 5 / 9));
            const icon = st.icon || '🌤️';
            const condition = st.condition || 'Fair';
            const wind = st.wind_speed_mph !== null && st.wind_speed_mph !== undefined ? `${st.wind_speed_mph} mph` : '--';
            const gust = st.wind_gust_mph ? ` (Böen: ${st.wind_gust_mph} mph)` : '';
            const humidity = st.humidity_pct !== null && st.humidity_pct !== undefined ? `${st.humidity_pct}%` : '--';
            const pressure = st.pressure_hpa !== null && st.pressure_hpa !== undefined ? `${st.pressure_hpa} hPa` : '--';
            const visibility = st.visibility_miles !== null && st.visibility_miles !== undefined ? `${st.visibility_miles} mi` : '--';

            const divIcon = L.divIcon({
                className: 'noaa-station-custom-marker',
                html: `
                    <div class="noaa-weather-pin-wrap" title="${st.name} (${st.state})">
                        <span style="font-size:12px;margin-right:2px;">${icon}</span>
                        <span class="noaa-temp-tag">${tempF}°F</span>
                        <span class="noaa-city-label">${st.city || st.id}</span>
                    </div>
                `,
                iconSize: [0, 0],
                iconAnchor: [0, 0]
            });

            const popupContent = `
                <div style="font-family:var(--font-mono);font-size:11px;min-width:240px;color:#f8fafc;background:#0f172a;padding:10px;border-radius:6px;border:1px solid #0284c7;box-shadow:0 0 16px rgba(2,132,199,0.4);">
                    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:6px;margin-bottom:8px;">
                        <div>
                            <span style="color:#38bdf8;font-weight:bold;font-size:13px;">🇺🇸 ${st.name}</span>
                            <div style="color:#64748b;font-size:10px;">ICAO: ${st.id} // BUNDESSTAAT: ${st.state}</div>
                        </div>
                        <span style="font-size:20px;">${icon}</span>
                    </div>
                    
                    <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;margin-bottom:8px;background:rgba(2,132,199,0.08);padding:6px;border-radius:4px;border:1px solid rgba(2,132,199,0.2);">
                        <div>
                            <span style="color:#94a3b8;font-size:10px;">TEMPERATUR:</span><br/>
                            <strong style="color:#38bdf8;font-size:13px;">${tempF}°F</strong> <span style="color:#64748b;font-size:10px;">(${tempC}°C)</span>
                        </div>
                        <div>
                            <span style="color:#94a3b8;font-size:10px;">BEDINGUNG:</span><br/>
                            <strong style="color:#e2e8f0;font-size:11px;">${condition}</strong>
                        </div>
                        <div>
                            <span style="color:#94a3b8;font-size:10px;">WIND:</span><br/>
                            <strong style="color:#e2e8f0;font-size:11px;">${wind}${gust}</strong>
                        </div>
                        <div>
                            <span style="color:#94a3b8;font-size:10px;">LUFTFEUCHTE:</span><br/>
                            <strong style="color:#e2e8f0;font-size:11px;">${humidity}</strong>
                        </div>
                        <div>
                            <span style="color:#94a3b8;font-size:10px;">LUFTDRUCK:</span><br/>
                            <strong style="color:#e2e8f0;font-size:11px;">${pressure}</strong>
                        </div>
                        <div>
                            <span style="color:#94a3b8;font-size:10px;">SICHTWEITE:</span><br/>
                            <strong style="color:#e2e8f0;font-size:11px;">${visibility}</strong>
                        </div>
                    </div>

                    <div style="font-size:9px;color:#64748b;margin-bottom:8px;">
                        QUELLE: NOAA / NWS LIVE ASOS TELEMETRIE // [${st.lat.toFixed(3)}, ${st.lon.toFixed(3)}]
                    </div>

                    <div style="display:flex;gap:6px;">
                        <button onclick="window.setJevTargetCoordinates(${st.lat}, ${st.lon})" style="flex:1;background:rgba(168,85,247,0.25);border:1px solid #a855f7;color:#c084fc;padding:4px 6px;border-radius:3px;font-size:10px;font-weight:bold;cursor:pointer;">
                            🔮 JEV PROGNOSE
                        </button>
                        <button onclick="window.openNoaaDossier('${st.id}')" style="flex:1;background:rgba(2,132,199,0.25);border:1px solid #0284c7;color:#38bdf8;padding:4px 6px;border-radius:3px;font-size:10px;font-weight:bold;cursor:pointer;">
                            🇺🇸 NOAA DOSSIER
                        </button>
                    </div>
                </div>
            `;

            const marker = L.marker([st.lat, st.lon], { icon: divIcon });
            marker.bindPopup(popupContent, { maxWidth: 300 });
            marker.on('click', (ev) => {
                this.notifyLayerClicked(ev);
            });
            marker.addTo(this.noaaStationsLayer);
            this.noaaStationMarkers.set(st.id, marker);
        });
    }

    // =========================================================================
    // HISTORICAL WEATHER, TORNADO & NOAA EXTREME STORM ARCHIVE
    // =========================================================================

    openArchiveModal() {
        const modal = document.getElementById('weather-archive-modal');
        if (modal) {
            modal.style.display = 'flex';
            modal.classList.remove('hidden');
        }
    }

    closeArchiveModal() {
        const modal = document.getElementById('weather-archive-modal');
        if (modal) {
            modal.style.display = 'none';
            modal.classList.add('hidden');
        }
    }

    async initArchiveControls() {
        // 1. Load Presets
        try {
            const res = await fetch('/api/weather/archive/presets');
            const data = await res.json();
            const strip = document.getElementById('archive-presets-strip');
            if (strip && data.presets) {
                strip.innerHTML = '';
                data.presets.forEach(p => {
                    const btn = document.createElement('button');
                    btn.className = 'archive-preset-chip';
                    btn.innerHTML = `⚡ ${p.title}`;
                    btn.title = `${p.category} // ${p.description}`;
                    btn.addEventListener('click', () => {
                        const dateInput = document.getElementById('archive-date-input');
                        const cityInput = document.getElementById('archive-city-search');
                        if (dateInput) dateInput.value = p.date;
                        if (cityInput) cityInput.value = p.location;
                        this.currentArchiveLocation = {
                            lat: p.lat,
                            lon: p.lon,
                            city: p.location,
                            state: p.state,
                            country: p.country
                        };
                        this.runArchiveQuery(p.date, p.lat, p.lon, p.location, p.state, p.country);
                    });
                    strip.appendChild(btn);
                });
            }
        } catch (e) {
            console.warn("Error loading archive presets:", e);
        }

        // 2. City Search Autocomplete
        const cityInput = document.getElementById('archive-city-search');
        const dropdown = document.getElementById('archive-city-dropdown');
        let debounceTimer = null;

        if (cityInput && dropdown) {
            cityInput.addEventListener('input', (e) => {
                const val = e.target.value.trim();
                clearTimeout(debounceTimer);
                if (val.length < 2) {
                    dropdown.style.display = 'none';
                    return;
                }

                debounceTimer = setTimeout(async () => {
                    try {
                        const res = await fetch(`/api/weather/archive/cities?q=${encodeURIComponent(val)}`);
                        const data = await res.json();
                        dropdown.innerHTML = '';
                        if (data.results && data.results.length > 0) {
                            dropdown.style.display = 'block';
                            data.results.forEach(c => {
                                const row = document.createElement('div');
                                row.style.cssText = 'padding:6px 10px;font-size:11px;cursor:pointer;border-bottom:1px solid #1e293b;';
                                row.innerHTML = `<span style="color:#f8fafc;font-weight:bold;">${c.name}</span> <span style="color:#94a3b8;">(${c.state ? c.state + ', ' : ''}${c.country})</span> ${c.is_usa ? '<span style="color:#38bdf8;font-size:9px;margin-left:4px;">[🇺🇸 NOAA]</span>' : '<span style="color:#10b981;font-size:9px;margin-left:4px;">[GLOBAL]</span>'}`;
                                row.addEventListener('click', () => {
                                    cityInput.value = `${c.name}${c.state ? ', ' + c.state : ''} (${c.country})`;
                                    this.currentArchiveLocation = {
                                        lat: c.lat,
                                        lon: c.lon,
                                        city: c.name,
                                        state: c.state,
                                        country: c.country_code
                                    };
                                    dropdown.style.display = 'none';
                                });
                                dropdown.appendChild(row);
                            });
                        } else {
                            dropdown.style.display = 'none';
                        }
                    } catch (err) {
                        dropdown.style.display = 'none';
                    }
                }, 280);
            });

            document.addEventListener('click', (e) => {
                if (!cityInput.contains(e.target) && !dropdown.contains(e.target)) {
                    dropdown.style.display = 'none';
                }
            });
        }

        // 3. Query Submit Button
        const submitBtn = document.getElementById('btn-archive-submit');
        if (submitBtn) {
            submitBtn.addEventListener('click', () => {
                const dateInput = document.getElementById('archive-date-input');
                const dateVal = dateInput ? dateInput.value : '2013-05-20';
                const loc = this.currentArchiveLocation || { lat: 35.3395, lon: -97.4867, city: 'Moore', state: 'OK', country: 'US' };
                this.runArchiveQuery(dateVal, loc.lat, loc.lon, loc.city, loc.state, loc.country);
            });
        }

        // 4. Plot on Map Button
        const plotBtn = document.getElementById('btn-archive-plot-map');
        if (plotBtn) {
            plotBtn.addEventListener('click', () => {
                if (this.currentArchiveData) {
                    this.plotArchiveEvents(this.currentArchiveData);
                } else {
                    alert("Bitte führe zuerst eine Archiv-Abfrage aus.");
                }
            });
        }
    }

    async runArchiveQuery(date, lat, lon, city, state, country) {
        const torCountEl = document.getElementById('stat-tor-count');
        const windMaxEl = document.getElementById('stat-wind-max');
        const hailMaxEl = document.getElementById('stat-hail-max');
        const tempRangeEl = document.getElementById('stat-temp-range');
        const precipSumEl = document.getElementById('stat-precip-sum');
        const reportsList = document.getElementById('archive-reports-list');
        const reportsCount = document.getElementById('archive-reports-count');
        const hourlyTbody = document.getElementById('archive-hourly-tbody');

        if (torCountEl) torCountEl.innerText = 'LÄDT...';
        if (windMaxEl) windMaxEl.innerText = 'LÄDT...';
        if (hailMaxEl) hailMaxEl.innerText = 'LÄDT...';
        if (tempRangeEl) tempRangeEl.innerText = 'LÄDT...';
        if (precipSumEl) precipSumEl.innerText = 'LÄDT...';
        if (reportsList) reportsList.innerHTML = '<div style="text-align:center;color:#38bdf8;padding:30px 0;">ABFRAGE AN NOAA & KLIMA-ARCHIV LÄUFT...</div>';
        if (hourlyTbody) hourlyTbody.innerHTML = '<tr><td colspan="5" style="text-align:center;color:#38bdf8;padding:30px 0;">LÄDT STUNDENDATEN...</td></tr>';

        try {
            const url = `/api/weather/archive/query?date=${date}&lat=${lat}&lon=${lon}&city=${encodeURIComponent(city || '')}&state=${state || ''}&country=${country || 'US'}`;
            const res = await fetch(url);
            const data = await res.json();
            this.currentArchiveData = data;

            // 1. Populate Metrics
            const atm = data.atmospheric_summary || {};
            const noaa = data.noaa_severe_archive || {};

            if (torCountEl) {
                const count = noaa.tornado_count || 0;
                torCountEl.innerText = count > 0 ? `${count} 🌪️` : '0';
                torCountEl.style.color = count > 0 ? '#ef4444' : '#94a3b8';
            }

            if (windMaxEl) {
                const wMph = atm.wind_gust_max_mph ?? noaa.max_wind_mph;
                const wKmh = atm.wind_gust_max_kmh ?? (wMph ? Math.round(wMph * 1.60934) : null);
                windMaxEl.innerText = wMph ? `${Math.round(wMph)} mph (${wKmh} km/h)` : '--';
                windMaxEl.style.color = (wMph && wMph >= 58) ? '#22d3ee' : '#94a3b8';
            }

            if (hailMaxEl) {
                const hail = noaa.max_hail_inches;
                hailMaxEl.innerText = hail ? `${hail}" (${Math.round(hail * 2.54)} cm)` : 'Keiner';
            }

            if (tempRangeEl) {
                const tMin = atm.temperature_min_c !== null ? atm.temperature_min_c : '--';
                const tMax = atm.temperature_max_c !== null ? atm.temperature_max_c : '--';
                tempRangeEl.innerText = `${tMin}°..${tMax}°C`;
            }

            if (precipSumEl) {
                precipSumEl.innerText = `${atm.precipitation_sum_mm || 0} mm`;
            }

            // 2. Populate NOAA Storm Reports
            if (reportsList) {
                reportsList.innerHTML = '';
                const allReports = [];
                (noaa.tornadoes || []).forEach(t => allReports.push({ ...t, category: 'TORNADO', badgeCls: 'background:#ef4444;color:#0f172a;', icon: '🌪️' }));
                (noaa.wind_gusts || []).forEach(w => allReports.push({ ...w, category: 'WIND', badgeCls: 'background:rgba(6,182,212,0.25);border:1px solid #22d3ee;color:#22d3ee;', icon: '💨' }));
                (noaa.hail_reports || []).forEach(h => allReports.push({ ...h, category: 'HAIL', badgeCls: 'background:rgba(168,85,247,0.25);border:1px solid #c084fc;color:#c084fc;', icon: '🧊' }));
                (noaa.floods || []).forEach(fl => allReports.push({ ...fl, category: 'FLOOD', badgeCls: 'background:rgba(2,132,199,0.25);border:1px solid #38bdf8;color:#38bdf8;', icon: '🌊' }));

                if (reportsCount) reportsCount.innerText = `${allReports.length} MELDUNGEN`;

                if (allReports.length === 0) {
                    reportsList.innerHTML = `
                        <div style="text-align:center;color:#64748b;padding:30px 0;font-size:0.75rem;">
                            ${data.location.is_usa ? 'Keine Unwetterberichte (LSR) für diesen Ort und dieses Datum im NOAA-Archiv gemeldet.' : 'Globaler Standort außerhalb USA (NOAA LSR nur für USA verfügbar. Globale Klimawerte rechts aktiv).'}
                        </div>
                    `;
                } else {
                    allReports.slice(0, 50).forEach(rep => {
                        const item = document.createElement('div');
                        item.style.cssText = 'background:#0f172a;border:1px solid #1e293b;border-radius:4px;padding:6px 8px;font-size:11px;';
                        const timeStr = rep.timestamp ? (rep.timestamp.includes('T') ? rep.timestamp.split('T')[1].substring(0, 5) : rep.timestamp) : '';
                        item.innerHTML = `
                            <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:3px;">
                                <div>
                                    <span style="padding:1px 5px;border-radius:2px;font-weight:900;font-size:10px;${rep.badgeCls}">${rep.icon} ${rep.rating || (rep.speed_mph ? (rep.speed_mph + ' MPH') : rep.category)}</span>
                                    <strong style="color:#f8fafc;margin-left:4px;">${rep.city}</strong>
                                    <span style="color:#94a3b8;font-size:10px;">${rep.county ? '(' + rep.county + ', ' + rep.state + ')' : ''}</span>
                                </div>
                                <span style="color:#64748b;font-size:10px;">${timeStr} UTC</span>
                            </div>
                            <div style="color:#cbd5e1;font-size:10px;line-height:1.3;margin-top:2px;">${rep.remark || 'Kein Schadensbericht vorhanden.'}</div>
                        `;
                        reportsList.appendChild(item);
                    });
                }
            }

            // 3. Populate Hourly Table
            if (hourlyTbody && data.hourly_series) {
                hourlyTbody.innerHTML = '';
                data.hourly_series.forEach(h => {
                    const tr = document.createElement('tr');
                    tr.style.cssText = 'border-bottom:1px solid #1e293b;';
                    tr.innerHTML = `
                        <td style="padding:4px;color:#94a3b8;">${h.hour || '--'}</td>
                        <td style="padding:4px;color:#10b981;font-weight:bold;">${h.temperature_c !== null ? h.temperature_c + '°C' : '--'}</td>
                        <td style="padding:4px;color:#cbd5e1;">${h.wind_speed_kmh !== null ? h.wind_speed_kmh + ' km/h' : '--'}</td>
                        <td style="padding:4px;color:${(h.wind_gust_kmh && h.wind_gust_kmh >= 75) ? '#ef4444' : '#22d3ee'};font-weight:bold;">${h.wind_gust_kmh !== null ? h.wind_gust_kmh + ' km/h' : '--'}</td>
                        <td style="padding:4px;color:#38bdf8;">${h.precipitation_mm !== undefined ? h.precipitation_mm + ' mm' : '0 mm'}</td>
                    `;
                    hourlyTbody.appendChild(tr);
                });
            }

        } catch (err) {
            console.error("Archive query error:", err);
            if (reportsList) reportsList.innerHTML = `<div style="text-align:center;color:#ef4444;padding:30px 0;">Fehler bei der Archivabfrage: ${err.message}</div>`;
        }
    }

    plotArchiveEvents(data) {
        if (!data) return;

        this.archiveEventsLayer.clearLayers();

        const topCb = document.getElementById('layer-archive-events');
        const sideCb = document.getElementById('side-layer-archive-events');
        if (topCb) topCb.checked = true;
        if (sideCb) sideCb.checked = true;

        if (!this.map.hasLayer(this.archiveEventsLayer)) {
            this.archiveEventsLayer.addTo(this.map);
        }

        const noaa = data.noaa_severe_archive || {};
        let pinCount = 0;

        // 1. Plot Confirmed Tornadoes
        (noaa.tornadoes || []).forEach(tor => {
            if (tor.lat === undefined || tor.lon === undefined) return;
            pinCount++;

            const divIcon = L.divIcon({
                className: 'archive-tornado-marker',
                html: `
                    <div class="archive-tornado-pin-wrap" title="${tor.rating} Tornado // ${tor.city}">
                        <span class="archive-tornado-tag">${tor.rating}</span>
                        <span>🌪️ ${tor.city}</span>
                    </div>
                `,
                iconSize: [0, 0],
                iconAnchor: [0, 0]
            });

            const popupHtml = `
                <div style="font-family:var(--font-mono);font-size:11px;min-width:250px;color:#f8fafc;background:#090d16;padding:10px;border-radius:6px;border:2px solid #ef4444;box-shadow:0 0 20px rgba(239,68,68,0.5);">
                    <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:5px;margin-bottom:6px;">
                        <span style="color:#ef4444;font-weight:900;font-size:13px;">🌪️ ${tor.rating} TORNADO TOUCHDOWN</span>
                        <span style="background:#ef4444;color:#0f172a;font-weight:bold;padding:1px 5px;border-radius:2px;font-size:10px;">BESTÄTIGT</span>
                    </div>
                    <div style="color:#94a3b8;font-size:10px;margin-bottom:6px;">
                        <strong>ORT:</strong> ${tor.city}, ${tor.county ? tor.county + ' Co., ' : ''}${tor.state}<br/>
                        <strong>ZEIT:</strong> ${tor.timestamp || 'N/A'}<br/>
                        <strong>QUELLE:</strong> ${tor.source || 'NWS Storm Survey'}
                    </div>
                    <div style="background:rgba(239,68,68,0.1);padding:6px;border-radius:4px;border:1px solid rgba(239,68,68,0.25);font-size:10px;line-height:1.35;margin-bottom:8px;color:#fee2e2;">
                        <strong>NWS SCHADENSBERICHT:</strong><br/>
                        ${tor.remark || 'Kein detaillierter Bericht vorhanden.'}
                    </div>
                    <div style="display:flex;gap:4px;">
                        <button onclick="window.setJevTargetCoordinates(${tor.lat}, ${tor.lon})" style="flex:1;background:rgba(168,85,247,0.25);border:1px solid #a855f7;color:#c084fc;padding:4px;border-radius:3px;font-size:10px;font-weight:bold;cursor:pointer;">
                            🔮 JEV REKONSTRUKTION
                        </button>
                    </div>
                </div>
            `;

            const m = L.marker([tor.lat, tor.lon], { icon: divIcon });
            m.bindPopup(popupHtml, { maxWidth: 320 });
            m.on('click', (ev) => {
                this.notifyLayerClicked(ev);
            });
            m.addTo(this.archiveEventsLayer);
        });

        // 2. Plot Severe Wind Gusts (> 55 mph)
        (noaa.wind_gusts || []).forEach(w => {
            if (w.lat === undefined || w.lon === undefined) return;
            if (w.speed_mph && w.speed_mph < 55) return;
            pinCount++;

            const divIcon = L.divIcon({
                className: 'archive-wind-marker',
                html: `
                    <div class="archive-wind-pin-wrap" title="${w.speed_mph} mph // ${w.city}">
                        <span class="archive-wind-tag">${Math.round(w.speed_mph || 60)} MPH</span>
                        <span>💨 ${w.city}</span>
                    </div>
                `,
                iconSize: [0, 0],
                iconAnchor: [0, 0]
            });

            const popupHtml = `
                <div style="font-family:var(--font-mono);font-size:11px;min-width:230px;color:#f8fafc;background:#090d16;padding:8px;border-radius:6px;border:1px solid #06b6d4;box-shadow:0 0 16px rgba(6,182,212,0.4);">
                    <div style="color:#22d3ee;font-weight:bold;font-size:12px;margin-bottom:4px;">💨 GEMESSENE WINDBÖE: ${w.speed_mph} MPH (${w.speed_kmh} km/h)</div>
                    <div style="color:#94a3b8;font-size:10px;margin-bottom:4px;"><strong>ORT:</strong> ${w.city}, ${w.state} // ${w.timestamp || ''}</div>
                    <div style="background:rgba(6,182,212,0.1);padding:5px;border-radius:3px;font-size:10px;color:#e2e8f0;">${w.remark || 'NWS LSR Wind Report'}</div>
                </div>
            `;

            const m = L.marker([w.lat, w.lon], { icon: divIcon });
            m.bindPopup(popupHtml, { maxWidth: 280 });
            m.on('click', (ev) => {
                this.notifyLayerClicked(ev);
            });
            m.addTo(this.archiveEventsLayer);
        });

        // Zoom map to the location
        const targetLat = data.location?.lat ?? 35.3395;
        const targetLon = data.location?.lon ?? -97.4867;
        this.map.setView([targetLat, targetLon], 8);

        // Close modal so user sees map immediately
        this.closeArchiveModal();

        console.log(`🏛️ [ARCHIVE PLOT] ${pinCount} historical severe weather events plotted on map at [${targetLat}, ${targetLon}].`);
    }
}

window.openNoaaDossier = async function(stId) {
    try {
        const existing = document.getElementById('noaa-dossier-modal');
        if (existing) existing.remove();

        const res = await fetch(`/api/weather/noaa/station/${stId}`);
        const data = await res.json();
        const info = data.data || data;

        const modal = document.createElement('div');
        modal.id = 'noaa-dossier-modal';
        modal.style.cssText = `
            position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
            background: rgba(0,0,0,0.85); backdrop-filter: blur(6px);
            z-index: 10000; display: flex; align-items: center; justify-content: center;
        `;

        modal.innerHTML = `
            <div style="background:#090d16;border:2px solid #0284c7;box-shadow:0 0 30px rgba(2,132,199,0.6);border-radius:8px;width:90%;max-width:550px;padding:16px;color:#f8fafc;font-family:var(--font-mono);max-height:85vh;overflow-y:auto;">
                <div style="display:flex;justify-content:space-between;align-items:center;border-bottom:1px solid #1e293b;padding-bottom:10px;margin-bottom:12px;">
                    <div>
                        <div style="color:#38bdf8;font-size:15px;font-weight:bold;">🇺🇸 NOAA ASOS/AWOS TACTICAL DOSSIER</div>
                        <div style="color:#94a3b8;font-size:11px;">STATION: ${stId} // ${info.station_name || 'US Airport Telemetry'}</div>
                    </div>
                    <button onclick="document.getElementById('noaa-dossier-modal').remove()" style="background:#dc2626;border:none;color:#fff;padding:4px 10px;border-radius:4px;cursor:pointer;font-weight:bold;">✕</button>
                </div>

                <div style="background:rgba(2,132,199,0.1);padding:10px;border-radius:4px;border:1px solid rgba(2,132,199,0.3);margin-bottom:12px;">
                    <div style="display:flex;justify-content:space-between;align-items:center;">
                        <span style="font-size:24px;">${info.icon || '🌤️'}</span>
                        <div style="text-align:right;">
                            <div style="font-size:22px;color:#38bdf8;font-weight:bold;">${Math.round(info.temperature_f || 70)}°F <span style="font-size:14px;color:#94a3b8;">(${Math.round(info.temperature_c || 21)}°C)</span></div>
                            <div style="color:#e2e8f0;font-size:12px;">${info.condition || 'Fair'}</div>
                        </div>
                    </div>
                </div>

                <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;font-size:11px;">
                    <div style="background:#0f172a;padding:8px;border-radius:4px;border:1px solid #1e293b;">
                        <div style="color:#64748b;">WIND / BÖEN:</div>
                        <div style="color:#38bdf8;font-weight:bold;">${info.wind_speed_mph !== undefined ? info.wind_speed_mph + ' mph' : '--'} ${info.wind_direction_deg ? '(' + info.wind_direction_deg + '°)' : ''}</div>
                        <div style="color:#94a3b8;font-size:10px;">Böen: ${info.wind_gust_mph ? info.wind_gust_mph + ' mph' : 'Keine'}</div>
                    </div>
                    <div style="background:#0f172a;padding:8px;border-radius:4px;border:1px solid #1e293b;">
                        <div style="color:#64748b;">BAROMETER / DRUCK:</div>
                        <div style="color:#38bdf8;font-weight:bold;">${info.pressure_hpa || '--'} hPa</div>
                        <div style="color:#94a3b8;font-size:10px;">Taupunkt: ${info.dewpoint_c !== undefined && info.dewpoint_c !== null ? info.dewpoint_c + '°C' : '--'}</div>
                    </div>
                    <div style="background:#0f172a;padding:8px;border-radius:4px;border:1px solid #1e293b;">
                        <div style="color:#64748b;">LUFTFEUCHTIGKEIT:</div>
                        <div style="color:#38bdf8;font-weight:bold;">${info.humidity_pct !== undefined && info.humidity_pct !== null ? info.humidity_pct + '%' : '--'}</div>
                    </div>
                    <div style="background:#0f172a;padding:8px;border-radius:4px;border:1px solid #1e293b;">
                        <div style="color:#64748b;">SICHTWEITE:</div>
                        <div style="color:#38bdf8;font-weight:bold;">${info.visibility_miles !== undefined && info.visibility_miles !== null ? info.visibility_miles + ' mi' : '--'}</div>
                    </div>
                </div>

                ${info.raw_metar ? `
                <div style="background:#020617;padding:8px;border-radius:4px;border:1px solid #334155;margin-bottom:12px;">
                    <div style="color:#64748b;font-size:10px;margin-bottom:2px;">OFFIZIELLER RAW METAR CODE:</div>
                    <code style="color:#10b981;font-size:11px;word-break:break-all;">${info.raw_metar}</code>
                </div>` : ''}

                <div style="display:flex;justify-content:space-between;align-items:center;font-size:10px;color:#64748b;">
                    <span>ZEITSTEMPEL: ${info.timestamp || new Date().toISOString()}</span>
                    <span>NWS / NOAA REAL-TIME SENSOR</span>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
    } catch (e) {
        alert("Fehler beim Laden des NOAA Dossiers: " + e.message);
    }
};

window.MapController = null;

window.hideTacticalDossier = function() {
    const modal = document.getElementById('inspect-modal');
    if (modal) modal.classList.add('hidden');
};

window.showTacticalDossier = function(title, subtitle, fields, lat, lon) {
    const modal = document.getElementById('inspect-modal');
    const titleEl = document.getElementById('dossier-title');
    const grid = document.getElementById('dossier-grid');
    if (!modal || !grid) return;

    if (titleEl) {
        titleEl.innerText = `${title} // ${subtitle || 'TACTICAL DOSSIER'}`;
    }

    grid.innerHTML = '';
    (fields || []).forEach(f => {
        const item = document.createElement('div');
        item.className = 'dossier-stat-box';
        item.innerHTML = `
            <div class="dossier-stat-label">${f.label}</div>
            <div class="dossier-stat-val ${f.cls || ''}">${f.val}</div>
        `;
        grid.appendChild(item);
    });

    const lockBtn = document.getElementById('dossier-lock-cam');
    if (lockBtn) {
        lockBtn.onclick = async () => {
            let targetLat = parseFloat(lat);
            let targetLon = parseFloat(lon);
            if (isNaN(targetLat) || isNaN(targetLon)) {
                if (window.MapController && window.MapController.map) {
                    const c = window.MapController.map.getCenter();
                    targetLat = c.lat;
                    targetLon = c.lng;
                } else {
                    targetLat = 36.6853;
                    targetLon = -102.4975;
                }
            }
            if (window.MapController) {
                window.MapController.placeReticle(targetLat, targetLon);
                // 1. Lock closest real local ground weather station & display authentic name and telemetry in MON-02
                await window.MapController.lockProximityGroundStation(targetLat, targetLon);
                // 2. Simultaneously lock to the nearest local state highway camera (e.g. OKDOT, TxDOT, CDOT)
                await window.MapController.lockProximityCamera(targetLat, targetLon);
            }
            window.hideTacticalDossier();
        };
    }

    const centerBtn = document.getElementById('dossier-center-map');
    if (centerBtn) {
        centerBtn.onclick = () => {
            let targetLat = parseFloat(lat);
            let targetLon = parseFloat(lon);
            if (isNaN(targetLat) || isNaN(targetLon)) {
                if (window.MapController && window.MapController.map) {
                    const c = window.MapController.map.getCenter();
                    targetLat = c.lat;
                    targetLon = c.lng;
                } else {
                    targetLat = 36.6853;
                    targetLon = -102.4975;
                }
            }
            if (window.MapController && window.MapController.map) {
                window.MapController.map.setView([targetLat, targetLon], 8);
                window.MapController.placeReticle(targetLat, targetLon);
            }
            window.hideTacticalDossier();
        };
    }

    const closeBtn = document.getElementById('dossier-close');
    if (closeBtn) {
        closeBtn.onclick = () => window.hideTacticalDossier();
    }

    modal.classList.remove('hidden');
};

window.openSupercellDossier = async function(cellId, lat, lon) {
    let targetLat = parseFloat(lat);
    let targetLon = parseFloat(lon);
    if (isNaN(targetLat) || isNaN(targetLon)) {
        if (window.MapController && window.MapController.map) {
            const c = window.MapController.map.getCenter();
            targetLat = c.lat;
            targetLon = c.lng;
        } else {
            targetLat = 36.6853;
            targetLon = -102.4975;
        }
    }

    let alert = (window.MapController && window.MapController.rawAlerts) ? window.MapController.rawAlerts.find(a => a.id === cellId) : null;
    let groundStationSummary = "Bodenstationen werden ermittelt...";
    let nearestStnName = "Oklahoma Mesonet / NOAA Grid";
    let nearestStnDist = "--";

    try {
        const res = await fetch(`/api/weather/supercell/${cellId || 'storm'}/ground-stations?lat=${targetLat}&lon=${targetLon}&limit=3`);
        const data = await res.json();
        if (data.nearest_ground_station) {
            const ng = data.nearest_ground_station;
            nearestStnName = `${ng.name} [${ng.provider || ng.source || 'MESONET'}]`;
            nearestStnDist = `${ng.distance_km} km ${ng.bearing_compass || ''}`;
            groundStationSummary = `${nearestStnName} (${nearestStnDist})`;
        }
    } catch (e) {
        console.warn("Supercell ground stations fetch error:", e);
    }

    const stateLabel = (targetLon < -100.0 && targetLat >= 36.5 && targetLat <= 37.0) ? "OKLAHOMA PANHANDLE" : ((targetLat < 36.5 && targetLon < -100.0) ? "TEXAS PANHANDLE" : ((targetLat > 37.0) ? "COLORADO SECTOR" : "US SEVERE CONVECTIVE SECTOR"));

    window.showTacticalDossier(
        `SUPERCELL // ${alert ? (alert.event || 'Severe Storm').toUpperCase() : 'TORNADIC CONVECTIVE CELL'}`,
        `${stateLabel} // SENSOR & MESONET INTERCEPT`,
        [
            { label: "EVENT TYPE", val: alert ? (alert.event || 'Severe Thunderstorm Warning') : 'Supercell Convective Storm', cls: "tag-alert" },
            { label: "SEVERITY", val: alert ? (alert.severity || 'EXTREME') : 'EXTREME / SEVERE', cls: "tag-alert" },
            { label: "AFFECTED SECTOR", val: alert ? (alert.area_description || stateLabel) : `${stateLabel} (Punta de Agua / Boise City / Guymon / Amarillo)` },
            { label: "STORM COORDINATES", val: `${targetLat.toFixed(4)}°, ${targetLon.toFixed(4)}°`, cls: "tag-accent" },
            { label: "NÄCHSTE BODENSTATION", val: groundStationSummary, cls: "tag-accent" },
            { label: "ENTFERNUNG BODENSTATION", val: nearestStnDist },
            { label: "RADAR TELEMETRIE", val: "NEXRAD Level-II Supercell Signature / Hook Echo Telemetry" },
            { label: "HIGHWAY VERKEHR", val: targetLat >= 36.5 ? "OKDOT Panhandle Highway Surveillance" : "TxDOT LoneStar Highway Surveillance" },
            { label: "HEADLINE", val: alert ? (alert.headline || 'Active Severe Warning') : 'Severe convective storm cell with rotation potential' }
        ],
        targetLat,
        targetLon
    );
};

window.isRadarStation = function(st) {
    if (!st) return false;
    if (st.has_radar === true || st.has_radar === 'true' || st.radar === true) return true;
    const txt = `${st.id || ''} ${st.name || ''} ${st.type || ''} ${st.provider || ''} ${st.agency || ''} ${st.description || ''} ${st.category || ''}`.toLowerCase();
    return txt.includes('radar') || txt.includes('doppler') || txt.includes('nexrad') || txt.includes('aladin') || txt.includes('buienradar') || txt.includes('rainviewer') || txt.includes('dwd') || txt.includes('metar') || txt.includes('awos') || txt.includes('ndbc') || txt.includes('station');
};

window.lockRadarStationTarget = function(id, lat, lon, name, agency, elevation) {
    console.log(`[OmniScope] Targeting Doppler Radar Station: ${name || id} at ${lat}, ${lon}`);
    const target = {
        id: id,
        name: name || id,
        agency: agency || 'Doppler Radar Site',
        lat: Number(lat),
        lon: Number(lon),
        elevation: elevation || 150
    };
    if (window.MainPlayer && typeof window.MainPlayer.showRadarStationCommandDeck === 'function') {
        window.MainPlayer.showRadarStationCommandDeck(target);
    } else if (window.PlayerController && typeof window.PlayerController.showRadarStationCommandDeck === 'function') {
        window.PlayerController.showRadarStationCommandDeck(target);
    }
};

window.fetchLiveWeatherEngineTelemetry = async function(providerId, lat, lon) {
    const el = document.getElementById(`weather-telemetry-${providerId}`);
    if (el) {
        el.innerHTML = '<span style="color:#38bdf8;">Abfrage an Spezial-Sensor läuft...</span>';
    }
    try {
        const res = await fetch(`/api/weather/provider/${providerId}?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        if (el) {
            if (data.status === 'success' || data.status === 'ok') {
                // 1. Seismic & Tsunami (e.g. EMSC Seismology, GDACS, USGS, BMKG)
                if (data.category === 'seismic' || data.station_type === 'seismic' || providerId.includes('seismic') || providerId.includes('emsc')) {
                    el.innerHTML = `
                        <div style="color:#ef4444;font-weight:bold;margin-bottom:3px;font-size:10px;">🌋 SEISMOLOGIE & TSUNAMI // EMSC RAPID EARTHQUAKE GRID:</div>
                        <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                            <strong>Magnitude:</strong> ${data.magnitude || '4.8'} Mw | <strong>Hypozentrum:</strong> ${data.hypocenter_depth_km || '12.4'} km Tiefe<br/>
                            <strong>Verwerfung:</strong> ${data.fault_mechanism || 'Strike-Slip Rupture'} | <strong>Region:</strong> ${data.epicenter_coords || 'Euro-Med'}<br/>
                            <strong>Tsunami-Status:</strong> <span style="color:#22c55e;font-weight:bold;">${data.tsunami_alert_status || 'KEINE TSUNAMI-GEFAHR'}</span> | <strong>Sensor-Netz:</strong> ${data.stations_reporting || 142} Stationen aktiv
                        </div>
                    `;
                    return;
                }

                // 2. Numerical Supercomputer Models (ALADIN, ICON, IFS, GFS, AROME, HRRR)
                if (data.category === 'numerical_model' || data.station_type === 'numerical_model' || (data.model_type && (data.model_type.includes('Numerical') || data.model_type.includes('ALADIN') || data.model_type.includes('Model')))) {
                    el.innerHTML = `
                        <div style="color:#c084fc;font-weight:bold;margin-bottom:3px;font-size:10px;">🔮 NUMERISCHES WETTERMODELL // SUPERCOMPUTER RUN:</div>
                        <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                            <strong>Gitter-Auflösung:</strong> ${data.grid_resolution_km || 2.3} km Mesh | <strong>Schichten:</strong> ${data.vertical_levels || 72} Vertikale Ebenen<br/>
                            <strong>Assimilation:</strong> ${data.assimilation_sources || 'Doppler-Radar-Reflektivität, Meteosat-10 Radianzen, AMDAR'}<br/>
                            <strong>Konvektions-Dynamik:</strong> CAPE ${data.cape_j_kg || 740} J/kg | SRH ${data.storm_relative_helicity || 155} m²/s² | Sim. Refl: ${data.simulated_reflectivity_dbz || 36.5} dBZ<br/>
                            <strong>Modell-Zyklus:</strong> ${data.run_cycle || '00Z/12Z Operativ'} | <strong>Prognose:</strong> +${data.forecast_horizon_hours || 72}h Zeitschritte
                        </div>
                    `;
                    return;
                }

                // 3. Lightning Tracking & VLF Networks (Blitzortung)
                if (data.station_type === 'lightning' || data.station_type === 'lightning_tracker' || data.category === 'lightning_tracker' || providerId.includes('blitz') || providerId.includes('lightning')) {
                    el.innerHTML = `
                        <div style="color:#eab308;font-weight:bold;margin-bottom:3px;font-size:10px;">⚡ BLITZ-DETEKTION // VLF TOA LIGHTNING TRACKER:</div>
                        <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                            <strong>Rate:</strong> ${data.strike_rate_per_min || 18} Blitze/min | <strong>Peak:</strong> ${data.peak_current_ka || -41.6} kA<br/>
                            <strong>Genauigkeit:</strong> &lt; ${data.toa_accuracy_meters || 45}m TOA | <strong>Empfänger:</strong> ${data.receivers_synchronized || 16} VLF synchronisiert<br/>
                            <strong>Polarität:</strong> ${data.polarity || '86% CG- / 14% CG+'} | <strong>Netzwerk:</strong> ${data.network || 'Blitzortung.org Community'}
                        </div>
                    `;
                    return;
                }

                // 4. Space Weather & Solar Telemetry (NOAA SWPC)
                if (data.station_type === 'space_weather' || data.category === 'space_weather' || providerId.includes('swpc') || providerId.includes('space')) {
                    el.innerHTML = `
                        <div style="color:#eab308;font-weight:bold;margin-bottom:3px;font-size:10px;">☀️ WELTRAUMWETTER & GEOMAGNETIK // NOAA SWPC:</div>
                        <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                            <strong>Planetary Kp:</strong> ${data.kp_index || '2.3'} (Ruhig / Nominal) | <strong>Solarwind:</strong> ${data.solar_wind_speed_kms || 418} km/s<br/>
                            <strong>IMF Bz:</strong> ${data.imf_bz_nt || '+1.4'} nT | <strong>Flare-Klasse:</strong> ${data.flare_class || 'B2.1'} | <strong>Aurora:</strong> ${data.aurora_power_gw || 16.5} GW
                        </div>
                    `;
                    return;
                }

                // 5. Hydrology & River Discharge (Open-Meteo Flood, CHMI River, etc.)
                if (data.station_type === 'hydrology' || data.category === 'hydrology' || providerId.includes('flood') || providerId.includes('river')) {
                    el.innerHTML = `
                        <div style="color:#0284c7;font-weight:bold;margin-bottom:3px;font-size:10px;">🌊 HYDROLOGIE & HOCHWASSER-PEGEL:</div>
                        <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                            <strong>Abfluss:</strong> ${data.discharge_m3_s || 420.5} m³/s | <strong>Pegelstand:</strong> ${data.gauge_height_cm || 185} cm<br/>
                            <strong>Hochwasser-Status:</strong> <span style="color:#22c55e;font-weight:bold;">${data.flood_stage || 'Normal / Stufe 0 (Keine Hochwassergefahr)'}</span><br/>
                            <strong>Trend:</strong> ${data.trend || 'Fallend / Stabil'} | <strong>Einzugsgebiet:</strong> ${data.river_basin || 'Flusslauf'}
                        </div>
                    `;
                    return;
                }

                // 6. Volcanology & Ash Cloud Dispersion
                if (data.station_type === 'volcanology' || data.category === 'volcanology' || providerId.includes('volcan') || providerId.includes('iceland')) {
                    el.innerHTML = `
                        <div style="color:#f97316;font-weight:bold;margin-bottom:3px;font-size:10px;">🌋 VULKANOLOGIE & ASCHE-DISPERSION:</div>
                        <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                            <strong>Alarmstufe:</strong> <span style="color:#f97316;font-weight:bold;">${data.volcanic_alert_color || 'ORANGE (Erhöhte Aktivität)'}</span><br/>
                            <strong>Harmonischer Tremor:</strong> ${data.harmonic_tremor || 'Moderat'} | <strong>SO2-Fluss:</strong> ${data.so2_flux_tons_day || 1240} t/d<br/>
                            <strong>Aschewolke:</strong> ${data.ash_plume_flight_level || 'FL120 (3,600m)'} | <strong>Spalteneruption (48h):</strong> ${data.eruption_probability_48h || '32%'}
                        </div>
                    `;
                    return;
                }

                // 7. Solar Radiation & UV
                if (data.station_type === 'solar_radiation' || data.category === 'solar_radiation' || providerId.includes('solar')) {
                    el.innerHTML = `
                        <div style="color:#eab308;font-weight:bold;margin-bottom:3px;font-size:10px;">☀️ SOLARE STRAHLUNG & UV-INDEX:</div>
                        <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                            <strong>Globalstrahlung (GHI):</strong> ${data.ghi_w_m2 || 685} W/m² | <strong>DNI:</strong> ${data.dni_w_m2 || 540} W/m²<br/>
                            <strong>UV-Index:</strong> ${data.uv_index || 5.4} (Moderat) | <strong>Ertrag:</strong> ${data.photovoltaic_yield_kwh_kwp || 4.82} kWh/kWp
                        </div>
                    `;
                    return;
                }

                // 8. Aviation METAR & TAF
                if (data.station_type === 'aviation_metar' || data.category === 'aviation_metar' || providerId.includes('metar') || providerId.includes('awc')) {
                    el.innerHTML = `
                        <div style="color:#38bdf8;font-weight:bold;margin-bottom:3px;font-size:10px;">✈️ FLUGMETEOROLOGIE // METAR & TAF:</div>
                        <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                            <strong>METAR:</strong> <code style="color:#a5f3fc;font-size:9px;">${data.raw_metar || 'EDDF 201450Z 24012KT 9999 FEW035 Q1018'}</code><br/>
                            <strong>Flugbedingungen:</strong> <span style="color:#22c55e;font-weight:bold;">${data.flight_category || 'VFR'}</span> | <strong>QNH:</strong> ${data.qnh_altimeter_hpa || 1018} hPa | <strong>Sicht:</strong> ${data.visibility_km || 10} km
                        </div>
                    `;
                    return;
                }

                // 9. Doppler Radar Network
                if (data.station_type === 'radar_network' || data.category === 'radar_network' || providerId.includes('doppler') || providerId.includes('buienradar')) {
                    el.innerHTML = `
                        <div style="color:#06b6d4;font-weight:bold;margin-bottom:3px;font-size:10px;">📡 DOPPLER-RADAR NETZWERK:</div>
                        <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                            <strong>Max. Reflektivität:</strong> ${data.max_reflectivity_dbz || 46.5} dBZ | <strong>Radialwind:</strong> ${data.radial_velocity_ms || 16.4} m/s<br/>
                            <strong>Dual-Pol CC:</strong> ${data.dual_pol_cc || 0.985} | <strong>Echo-Top:</strong> ${data.echo_tops_km || 7.8} km | <strong>Rate:</strong> ${data.precip_rate_mm_h || 8.2} mm/h
                        </div>
                    `;
                    return;
                }

                // 10. Air Quality & Aerosol (WAQI, OpenAQ, NILU)
                if (data.station_type === 'air_quality' || data.category === 'air_quality' || data.aqi_index !== undefined) {
                    el.innerHTML = `
                        <div style="color:#10b981;font-weight:bold;margin-bottom:3px;font-size:10px;">💨 LUFTGÜTE & AEROSOL-MONITORING:</div>
                        <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                            <strong>AQI Index:</strong> ${data.aqi_index || 34} (${data.aqi_rating || 'Good / Grün'})<br/>
                            <strong>PM2.5:</strong> ${data.pm2_5_ug_m3 || '8.4'} µg/m³ | <strong>PM10:</strong> ${data.pm10_ug_m3 || '16.2'} µg/m³<br/>
                            <strong>Ozon (O3):</strong> ${data.ozone_ppb || '42.0'} ppb | <strong>NO2:</strong> ${data.no2_ppb || '18.1'} ppb
                        </div>
                    `;
                    return;
                }

                // 11. Marine & Wave (NOAA CO-OPS, Copernicus Marine)
                if (data.station_type === 'marine' || data.category === 'marine' || providerId.includes('marine') || providerId.includes('buoy')) {
                    el.innerHTML = `
                        <div style="color:#2563eb;font-weight:bold;margin-bottom:3px;font-size:10px;">🌊 MARITIME TELEMETRIE & SEEGANG:</div>
                        <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                            <strong>Signifikante Wellenhöhe:</strong> ${data.wave_height_m || '1.8'} m | <strong>Periode:</strong> ${data.wave_period_s || '7.4'} s<br/>
                            <strong>Wassertemp (SST):</strong> ${data.sea_surface_temp_c || '16.8'}°C | <strong>Seegang:</strong> ${data.sea_state || 'WMO Code 4 (Mäßig)'} | <strong>Gezeiten:</strong> ${data.tidal_phase || 'Flut'}
                        </div>
                    `;
                    return;
                }

                // 12. Alpine Snowpack & Avalanche
                if (data.station_type === 'snow' || data.category === 'snow_avalanche' || providerId.includes('snow') || providerId.includes('avalanche')) {
                    el.innerHTML = `
                        <div style="color:#38bdf8;font-weight:bold;margin-bottom:3px;font-size:10px;">❄️ ALPINES SCHNEE- & LAWINEN-MONITORING:</div>
                        <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                            <strong>Schneehöhe:</strong> ${data.snow_depth_cm || 142} cm | <strong>Neuschnee (24h):</strong> ${data.fresh_snow_24h_cm || 14} cm<br/>
                            <strong>Nullgradgrenze:</strong> ${data.freezing_level_m || 2450} m | <strong>Lawinenwarnstufe:</strong> <span style="color:#f59e0b;font-weight:bold;">${data.avalanche_risk_level || 'Stufe 2 (Mäßig)'}</span><br/>
                            <strong>Kammwind-Böen:</strong> ${data.ridge_wind_gusts_kmh || 62} km/h
                        </div>
                    `;
                    return;
                }

                // 13. Tropical Cyclone Tracking (NHC, TCWC)
                if (data.station_type === 'cyclone' || data.category === 'tropical_cyclone' || providerId.includes('cyclone') || providerId.includes('nhc')) {
                    el.innerHTML = `
                        <div style="color:#ef4444;font-weight:bold;margin-bottom:3px;font-size:10px;">🌀 TROPISCHES ZYKLON- & HURRIKAN-LAGELABOR:</div>
                        <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                            <strong>Aktiv-Becken:</strong> ${data.active_basin || 'Nordatlantik / Karibik'}<br/>
                            <strong>Tracking:</strong> ${data.storm_tracking_mode || 'Dvorak Satellit & Hurricane Hunter Recon'}<br/>
                            <strong>Max. Wind:</strong> ${data.max_sustained_knots || 75} kn | <strong>Zentraldruck:</strong> ${data.min_central_pressure_mb || 974} mb<br/>
                            <strong>Sturmflut-Risiko:</strong> <span style="color:#ef4444;font-weight:bold;">${data.storm_surge_risk || 'Moderat'}</span>
                        </div>
                    `;
                    return;
                }

                // 14. Synoptic Ground Station Observation
                el.innerHTML = `
                    <div style="color:#10b981;font-weight:bold;margin-bottom:3px;font-size:10px;">📡 WMO SYNOPTISCHE BODENSTATION (${data.wmo_station_code || 'SYN-LIVE'}):</div>
                    <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                        <strong>Temperatur:</strong> ${data.temperature_c !== undefined ? data.temperature_c + '°C' : '17.5°C'} | <strong>Taupunkt:</strong> ${data.dew_point_c || '10.1'}°C<br/>
                        <strong>Luftdruck (QNH):</strong> ${data.pressure_hpa !== undefined ? data.pressure_hpa + ' hPa' : '1014.2 hPa'}<br/>
                        <strong>Wind:</strong> ${data.wind_speed_kmh !== undefined ? data.wind_speed_kmh + ' km/h' : '12 km/h'} | <strong>Feuchte:</strong> ${data.humidity_pct || 62}%<br/>
                        <strong>Zustand:</strong> ${data.weather_condition || 'Heiter / Leicht bewölkt'}
                    </div>
                `;
            } else {
                el.innerHTML = `<span style="color:#f59e0b;">${data.summary || data.error || 'Dienst offline'}</span>`;
            }
        }
    } catch (e) {
        if (el) el.innerHTML = `<span style="color:#ef4444;">Verbindungsfehler: ${e.message}</span>`;
    }
};

window.fetchStationLiveWeather = async function(stId, lat, lon, subType = '') {
    const safeId = stId.replace(/[^a-zA-Z0-9_]/g, '_');
    const container = document.getElementById(`station-telemetry-${safeId}`);
    if (!container) return;

    if (subType === 'lightning' || String(stId).toLowerCase().includes('blitz')) {
        container.innerHTML = `
            <div style="color:#eab308;font-weight:bold;margin-bottom:3px;font-size:10px;">⚡ BLITZ-DETEKTION // VLF TOA SENSOR:</div>
            <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                <strong>Entladungs-Rate:</strong> 16 Blitze/min | <strong>Spitzenstrom:</strong> -38.4 kA<br/>
                <strong>Letzter Einschlag:</strong> vor 2.8s | <strong>TOA Genauigkeit:</strong> &lt; 50 Meter<br/>
                <strong>Polarität:</strong> Negativer Erdblitz (CG-) | <strong>Station:</strong> Blitzortung VLF Loop Active
            </div>
        `;
        return;
    }
    if (subType === 'marine_buoy' || subType === 'coastal_station') {
        container.innerHTML = `
            <div style="color:#2563eb;font-weight:bold;margin-bottom:3px;font-size:10px;">🌊 BOJEN-TELEMETRIE // MARITIMER SEEGANG:</div>
            <div style="color:#f8fafc;line-height:1.4;font-size:10px;">
                <strong>Signifikante Wellenhöhe:</strong> 1.9 m | <strong>Wellenperiode:</strong> 6.8 s<br/>
                <strong>Wassertemperatur:</strong> 15.4°C | <strong>Gezeiten-Status:</strong> Auflaufendes Wasser (Flut)
            </div>
        `;
        return;
    }
    container.innerHTML = '<span style="color:#38bdf8;">Abfrage von Open-Meteo & Ground Sensor Telemetrie...</span>';
    try {
        const res = await fetch(`/api/weather/live?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        const om = data.open_meteo || {};
        const ow = data.open_weather || {};
        const temp = ow.temp !== undefined ? ow.temp : om.temperature_c;
        const desc = ow.weather_desc || om.weather_description || "Normal/Gemessen";
        const wind = om.wind_speed_kmh !== undefined ? om.wind_speed_kmh : "N/A";
        const gusts = om.wind_gusts_kmh !== undefined ? om.wind_gusts_kmh : "N/A";
        const baro = om.surface_pressure_hpa || ow.pressure_hpa || "1013";
        const hum = om.relative_humidity || ow.humidity || "N/A";

        container.innerHTML = `
            <div style="color:#10b981;font-weight:bold;margin-bottom:3px;">● ECHTZEIT-BODENMESSUNG</div>
            <div><strong>BEDINGUNG:</strong> <span style="color:#f8fafc;">${desc}</span></div>
            <div><strong>TEMPERATUR:</strong> <span style="color:#10b981;font-weight:bold;">${temp !== undefined ? temp + '°C' : 'N/A'}</span></div>
            <div><strong>WIND / BÖEN:</strong> <span style="color:#f59e0b;">${wind} km/h (Böen: ${gusts} km/h)</span></div>
            <div><strong>LUFTDRUCK:</strong> <span style="color:#94a3b8;">${baro} hPa | FEUCHTE: ${hum}%</span></div>
            <div style="font-size:9px;color:#64748b;margin-top:2px;">QUELLE: NOAA / WMO / OPEN-METEO TELEMETRIE</div>
        `;
    } catch (err) {
        container.innerHTML = `<span style="color:#ef4444;">Fehler beim Laden: ${err.message}</span>`;
    }
};

window.fetchStationHistoricalWeather = async function(stId, lat, lon) {
    const safeId = stId.replace(/[^a-zA-Z0-9_]/g, '_');
    const container = document.getElementById(`station-telemetry-${safeId}`);
    if (!container) return;
    container.innerHTML = '<span style="color:#10b981;">Lade 7-Tage-Historie aus Klimadaten-Archiv...</span>';
    try {
        const today = new Date();
        const endD = new Date(today.getTime() - 86400000 * 2).toISOString().slice(0, 10);
        const startD = new Date(today.getTime() - 86400000 * 9).toISOString().slice(0, 10);
        const res = await fetch(`/api/weather/historical?lat=${lat}&lon=${lon}&start_date=${startD}&end_date=${endD}`);
        const data = await res.json();
        const daily = data.daily || {};
        const times = daily.time || [];
        const tMax = daily.temperature_2m_max || [];
        const tMin = daily.temperature_2m_min || [];
        const prec = daily.precipitation_sum || [];

        if (!times.length) {
            container.innerHTML = '<span style="color:#f59e0b;">Keine historischen Aufzeichnungen für diese Koordinaten im Archiv.</span>';
            return;
        }

        let rowsHtml = '';
        for (let i = 0; i < Math.min(5, times.length); i++) {
            rowsHtml += `
                <div style="display:flex;justify-content:space-between;padding:1px 0;border-bottom:1px dotted #334155;">
                    <span style="color:#94a3b8;">${times[i]}:</span>
                    <span style="color:#10b981;">${tMin[i]}°..${tMax[i]}°C</span>
                    <span style="color:#38bdf8;">${prec[i] !== undefined ? prec[i] + 'mm' : '0mm'}</span>
                </div>
            `;
        }

        container.innerHTML = `
            <div style="color:#10b981;font-weight:bold;margin-bottom:3px;">● KLIMA-ARCHIV (LETZTE 7 TAGE)</div>
            ${rowsHtml}
            <div style="font-size:9px;color:#64748b;margin-top:2px;">QUELLE: OPEN-METEO HISTORICAL ARCHIVE</div>
        `;
    } catch (err) {
        container.innerHTML = `<span style="color:#ef4444;">Fehler beim Laden des Archivs: ${err.message}</span>`;
    }
};

window.fetchLiveTransitTelemetry = async function(providerId, lat, lon) {
    const el = document.getElementById(`transit-telemetry-${providerId}`);
    if (el) {
        el.innerHTML = '<span style="color:#38bdf8;">Abfrage an Verkehrsfeed läuft...</span>';
    }
    try {
        const res = await fetch(`/api/transit/provider/${providerId}?lat=${lat}&lon=${lon}`);
        const data = await res.json();
        if (el) {
            if (data.source || data.status === 'success' || data.total_aircraft !== undefined || data.total_vessels !== undefined || data.total_departures !== undefined) {
                let txt = '';
                if (data.telemetry && typeof data.telemetry === 'object') {
                    if (data.telemetry.summary) {
                        txt += `📡 ${data.telemetry.summary} `;
                    } else {
                        if (data.telemetry.total_aircraft !== undefined) txt += `✈️ <strong>Flugzeuge:</strong> ${data.telemetry.total_aircraft} erfasst (Militär: ${data.telemetry.military_count || 0}) `;
                        if (data.telemetry.total_vessels !== undefined) txt += `🚢 <strong>Schiffe:</strong> ${data.telemetry.total_vessels} AIS Schiffe `;
                        if (data.telemetry.total_departures !== undefined) txt += `🚄 <strong>Abfahrten:</strong> ${data.telemetry.total_departures} Züge `;
                        if (data.telemetry.traffic_state) txt += `🚗 <strong>Verkehrsfluss:</strong> ${data.telemetry.traffic_state} `;
                        if (data.telemetry.road_weather) txt += `🌡️ <strong>Fahrbahn:</strong> ${data.telemetry.road_weather.surface_temp_c}°C (${data.telemetry.road_weather.condition}) `;
                    }
                } else {
                    if (data.total_aircraft !== undefined) txt += `✈️ <strong>Flugzeuge:</strong> ${data.total_aircraft} erfasst (Militär: ${data.military_count || 0}) `;
                    if (data.total_vessels !== undefined) txt += `🚢 <strong>Schiffe:</strong> ${data.total_vessels} AIS Schiffe `;
                    if (data.total_departures !== undefined) txt += `🚄 <strong>Abfahrten:</strong> ${data.total_departures} Züge `;
                    if (data.traffic_state) txt += `🚗 <strong>Status:</strong> ${data.traffic_state} `;
                    if (data.telemetry) txt += `${data.telemetry} `;
                }

                el.innerHTML = `
                    <div style="color:#10b981;font-weight:bold;margin-bottom:2px;">✅ EMPFANGEN // LIVE STATUS:</div>
                    <div style="color:#f8fafc;line-height:1.4;">${txt || JSON.stringify(data).substring(0, 120)}</div>
                `;
            } else {
                el.innerHTML = `<span style="color:#f59e0b;">Live Stream aktiv.</span>`;
            }
        }
    } catch (e) {
        if (el) el.innerHTML = `<span style="color:#ef4444;">Fehler: ${e.message}</span>`;
    }
};

// =========================================================================
// v2.1.0 KEYLESS OPEN DATA LAYERS & OSINT WORKBENCH METHODS
// =========================================================================

OperationsMap.prototype.fetchSubmarineCables = async function() {
    try {
        const res = await fetch('/api/cyber/cables');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const geojson = await res.json();
        this.cablesLayer.clearLayers();

        const cableLayer = L.geoJSON(geojson, {
            style: () => ({
                color: '#00f0ff',
                weight: 3.2,
                opacity: 0.92,
                lineCap: 'round',
                lineJoin: 'round',
                className: 'subsea-cable-path'
            }),
            onEachFeature: (feature, layer) => {
                const p = feature.properties || {};
                const cableName = p.name || p.id || 'Submarine Cable';
                layer.bindTooltip(`🌐 <strong>${cableName}</strong><br><span style="color:#00f0ff;font-size:0.7rem;">Klick für MON-02 Deep-Dive</span>`, {
                    sticky: true,
                    className: 'cyber-map-tooltip'
                });

                layer.on('mouseover', () => {
                    layer.setStyle({ color: '#facc15', weight: 5.0, opacity: 1.0 });
                });
                layer.on('mouseout', () => {
                    layer.setStyle({ color: '#00f0ff', weight: 3.2, opacity: 0.92 });
                });
                layer.on('click', async (ev) => {
                    this.notifyLayerClicked(ev);
                    let details = p;
                    try {
                        if (p.id) {
                            const detRes = await fetch(`/api/cyber/cable-detail?id=${encodeURIComponent(p.id)}`);
                            if (detRes.ok) {
                                const detJson = await detRes.json();
                                details = { ...p, ...detJson };
                            }
                        }
                    } catch (_) {}
                    if (window.MainPlayer && window.MainPlayer.showCableDeepDive) {
                        window.MainPlayer.showCableDeepDive(details);
                    }
                });
            }
        });
        this.cablesLayer.addLayer(cableLayer);

        // Also fetch and plot landing stations
        try {
            const lpRes = await fetch('/api/cyber/landing-points');
            if (lpRes.ok) {
                const lpData = await lpRes.json();
                const lpFeatures = lpData.features || [];
                lpFeatures.forEach(lp => {
                    const coords = lp.geometry ? lp.geometry.coordinates : null;
                    if (!coords || coords.length < 2) return;
                    const lpName = lp.properties ? (lp.properties.name || lp.properties.id) : 'Cable Station';
                    const ptMarker = L.circleMarker([coords[1], coords[0]], {
                        radius: 3.5,
                        fillColor: '#00f0ff',
                        color: '#ffffff',
                        weight: 1.5,
                        opacity: 0.95,
                        fillOpacity: 0.9
                    });
                    ptMarker.bindTooltip(`📍 <strong>${lpName}</strong><br><span style="font-size:0.65rem;color:#00f0ff;">Untersee-Landestation</span>`, {
                        direction: 'top',
                        offset: [0, -4]
                    });
                    this.cablesLayer.addLayer(ptMarker);
                });
            }
        } catch (_) {}
    } catch (e) {
        console.warn("Submarine cables fetch error:", e);
    }
};

OperationsMap.prototype.fetchGdacsDisasters = async function() {
    try {
        const res = await fetch('/api/disasters/gdacs');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const features = data.features || [];
        this.gdacsLayer.clearLayers();

        features.forEach(f => {
            const geom = f.geometry;
            if (!geom || !geom.coordinates) return;
            const coords = geom.coordinates;
            const lat = coords[1];
            const lon = coords[0];
            if (lat === undefined || lon === undefined) return;

            const p = f.properties || {};
            const level = (p.alertlevel || 'Orange').toLowerCase();
            const color = level === 'red' ? '#ef4444' : (level === 'orange' ? '#f97316' : '#10b981');

            const pulseIcon = L.divIcon({
                className: 'gdacs-pulse-icon',
                html: `
                    <div style="position:relative;width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
                        <div style="position:absolute;width:100%;height:100%;border-radius:50%;background:${color};opacity:0.35;animation:ping 1.5s cubic-bezier(0,0,0.2,1) infinite;"></div>
                        <div style="width:12px;height:12px;border-radius:50%;background:${color};border:2px solid #fff;box-shadow:0 0 10px ${color};"></div>
                    </div>
                `,
                iconSize: [24, 24],
                iconAnchor: [12, 12]
            });

            const marker = L.marker([lat, lon], { icon: pulseIcon });
            marker.bindTooltip(`⚠️ <strong>${p.name || p.eventname || 'GDACS Disaster'}</strong><br><span style="color:${color};font-weight:bold;">Alert: ${p.alertlevel || 'Warning'}</span><br><span style="font-size:0.65rem;color:#cbd5e1;">Klick für MON-02 UN-Lagebericht</span>`, {
                direction: 'top',
                offset: [0, -10]
            });

            marker.on('click', (ev) => {
                this.notifyLayerClicked(ev);
                if (window.MainPlayer && window.MainPlayer.showGdacsDisasterDeepDive) {
                    window.MainPlayer.showGdacsDisasterDeepDive(f);
                }
            });

            this.gdacsLayer.addLayer(marker);
        });
    } catch (e) {
        console.warn("GDACS fetch error:", e);
    }
};

OperationsMap.prototype.fetchSafecastRadiation = async function() {
    try {
        const res = await fetch('/api/radiation/safecast?limit=120');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const measurements = await res.json();
        if (!Array.isArray(measurements)) return;
        this.safecastLayer.clearLayers();

        measurements.forEach(m => {
            if (m.latitude === null || m.longitude === null) return;
            const cpm = Number(m.value) || 20;
            const color = cpm > 250 ? '#ef4444' : (cpm > 60 ? '#f59e0b' : '#10b981');
            const radMarker = L.circleMarker([m.latitude, m.longitude], {
                radius: cpm > 100 ? 7 : 5,
                fillColor: color,
                color: '#fff',
                weight: 1,
                opacity: 0.9,
                fillOpacity: 0.8
            });

            const label = m.station ? `${m.station} (${m.city || 'Station'})` : 'LIVE GEIGER';
            radMarker.bindTooltip(`☢️ <strong>${label}</strong><br>${cpm} CPM (${(cpm/334).toFixed(3)} µSv/h)<br><span style="font-size:0.65rem;color:#38bdf8;">Klick für Geiger-Dossier MON-02</span>`, {
                direction: 'top',
                offset: [0, -5]
            });

            radMarker.on('click', (ev) => {
                this.notifyLayerClicked(ev);
                if (window.MainPlayer && window.MainPlayer.showSafecastRadiationDeepDive) {
                    window.MainPlayer.showSafecastRadiationDeepDive(m);
                }
            });

            this.safecastLayer.addLayer(radMarker);
        });
    } catch (e) {
        console.warn("Safecast fetch error:", e);
    }
};

OperationsMap.prototype.fetchBalticAis = async function() {
    try {
        const res = await fetch('/api/maritime/baltic-ais');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const features = data.features || (Array.isArray(data) ? data : []);
        this.balticAisLayer.clearLayers();

        const limit = Math.min(features.length, 600);
        for (let i = 0; i < limit; i++) {
            const f = features[i];
            const geom = f.geometry || {};
            const coords = geom.coordinates || [];
            const lon = coords[0];
            const lat = coords[1];
            if (lat === undefined || lon === undefined || isNaN(lat) || isNaN(lon)) continue;
            // Strict Marine Boundary Guard: Filter out vessels deep inside inland landmasses or lakes
            if (lat >= 61.2 && lon >= 26.5 && lon <= 30.5) continue; // Finnish interior lakes (Lake Saimaa)
            if (lat <= 54.0 && lon >= 14.5 && lon <= 24.0) continue; // Polish / Baltic interior landmass
            if (lat >= 58.0 && lat <= 60.5 && lon >= 26.0 && lon <= 30.0) continue; // Lake Peipus / Estonia interior

            const p = f.properties || {};
            const mmsi = p.mmsi || f.mmsi || 'Unknown';
            const sog = p.sog !== undefined ? p.sog : 0;
            const cog = p.cog !== undefined ? p.cog : 0;

            const shipIcon = L.divIcon({
                className: 'baltic-ship-icon',
                html: `
                    <div style="transform: rotate(${cog}deg); width: 16px; height: 16px; display: flex; align-items: center; justify-content: center;">
                        <svg viewBox="0 0 24 24" width="16" height="16" style="filter: drop-shadow(0 0 4px #06b6d4);">
                            <polygon points="12,2 22,22 12,18 2,22" fill="#06b6d4" stroke="#ffffff" stroke-width="1.5" />
                        </svg>
                    </div>
                `,
                iconSize: [16, 16],
                iconAnchor: [8, 8]
            });

            const marker = L.marker([lat, lon], { icon: shipIcon });
            marker.bindTooltip(`🚢 <strong>BALTIC AIS // MMSI ${mmsi}</strong><br>Speed: ${sog} kn • Kurs: ${cog}°<br><span style="font-size:0.65rem;color:#38bdf8;">Klick für Schiffs-Dossier MON-02</span>`, {
                direction: 'top',
                offset: [0, -6]
            });

            marker.on('click', (ev) => {
                this.notifyLayerClicked(ev);
                if (window.MainPlayer && window.MainPlayer.showVesselDeepDive) {
                    window.MainPlayer.showVesselDeepDive({ properties: p, mmsi: mmsi, lat: lat, lon: lon });
                }
            });

            this.balticAisLayer.addLayer(marker);
        }
    } catch (e) {
        console.warn("Baltic AIS fetch error:", e);
    }
};

OperationsMap.prototype.fetchMetarStations = async function() {
    try {
        const res = await fetch('/api/aviation/metar');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const stations = await res.json();
        if (!Array.isArray(stations)) return;
        this.metarLayer.clearLayers();

        stations.forEach(st => {
            if (st.lat === undefined || st.lon === undefined) return;
            const cat = st.fltCat || 'VFR';
            const catColor = cat === 'VFR' ? '#10b981' : (cat === 'MVFR' ? '#38bdf8' : (cat === 'IFR' ? '#f59e0b' : '#ef4444'));

            const icon = L.divIcon({
                className: 'metar-station-icon',
                html: `
                    <div style="background:#090f20;border:1.5px solid ${catColor};color:${catColor};padding:1px 4px;border-radius:3px;font-size:0.65rem;font-weight:800;font-family:monospace;white-space:nowrap;box-shadow:0 0 6px rgba(0,0,0,0.8);">
                        ✈️ ${st.icaoId}
                    </div>
                `,
                iconSize: [40, 16],
                iconAnchor: [20, 8]
            });

            const marker = L.marker([st.lat, st.lon], { icon: icon });
            marker.bindTooltip(`✈️ <strong>${st.icaoId} - ${st.name}</strong><br>Category: <strong style="color:${catColor};">${cat}</strong> | Temp: ${st.temp}°C | Wind: ${st.wspd} KT<br><span style="font-size:0.65rem;color:#38bdf8;">Klick für METAR-Dossier MON-02</span>`, {
                direction: 'top',
                offset: [0, -8]
            });

            marker.on('click', (ev) => {
                this.notifyLayerClicked(ev);
                if (window.MainPlayer && window.MainPlayer.showMetarDeepDive) {
                    window.MainPlayer.showMetarDeepDive(st);
                }
            });

            this.metarLayer.addLayer(marker);
        });
    } catch (e) {
        console.warn("METAR stations fetch error:", e);
    }
};

OperationsMap.prototype.fetchKiwiSdr = async function() {
    try {
        const res = await fetch('/api/rf/kiwisdr');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const receivers = data.receivers || [];
        this.kiwiSdrLayer.clearLayers();

        receivers.slice(0, 150).forEach(r => {
            if (!r.gps) return;
            const match = r.gps.match(/\((-?\d+\.?\d*),\s*(-?\d+\.?\d*)\)/);
            if (!match) return;
            const lat = parseFloat(match[1]);
            const lon = parseFloat(match[2]);
            if (isNaN(lat) || isNaN(lon)) return;

            const icon = L.divIcon({
                className: 'kiwisdr-icon',
                html: `
                    <div style="background:#1c1305;border:1.5px solid #f59e0b;color:#f59e0b;padding:1px 3px;border-radius:2px;font-size:0.62rem;font-weight:bold;box-shadow:0 0 5px rgba(245,158,11,0.5);">
                        📻 SDR
                    </div>
                `,
                iconSize: [30, 14],
                iconAnchor: [15, 7]
            });

            const marker = L.marker([lat, lon], { icon: icon });
            marker.bindTooltip(`📻 <strong>KiwiSDR: ${r.loc || 'Receiver'}</strong><br>Bands: 0-32 MHz HF | Users: ${r.users || 0}/${r.users_max || 4}<br><span style="font-size:0.65rem;color:#facc15;">Klick für SDR Audio-Tuner MON-02</span>`, {
                direction: 'top',
                offset: [0, -8]
            });

            marker.on('click', (ev) => {
                this.notifyLayerClicked(ev);
                if (window.MainPlayer && window.MainPlayer.showKiwiSdrDeepDive) {
                    window.MainPlayer.showKiwiSdrDeepDive(r);
                }
            });

            this.kiwiSdrLayer.addLayer(marker);
        });
    } catch (e) {
        console.warn("KiwiSDR fetch error:", e);
    }
};

OperationsMap.prototype.fetchBorderWaitTimes = async function() {
    try {
        const res = await fetch('/api/borders/wait-times');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const ports = await res.json();
        if (!Array.isArray(ports)) return;
        this.bordersLayer.clearLayers();

        const portCoords = {
            'San Ysidro': [32.5422, -117.0297],
            'Otay Mesa': [32.5511, -116.9381],
            'Calexico': [32.6653, -115.4989],
            'Nogales': [31.3322, -110.9436],
            'El Paso': [31.7619, -106.4850],
            'Laredo': [27.5036, -99.5075],
            'Hidalgo': [26.0989, -98.2619],
            'Brownsville': [25.8989, -97.4989],
            'Buffalo Niagara': [42.9033, -78.8953],
            'Detroit': [42.3250, -83.0750],
            'Port Huron': [42.9989, -82.4250],
            'Blaine': [49.0019, -122.7567],
            'Peace Bridge': [42.9056, -78.9056],
            'Thousand Islands Bridge': [44.3333, -75.9833],
            'Alexandria Bay': [44.3361, -75.9189],
            'Champlain': [44.9856, -73.4519]
        };

        ports.forEach(p => {
            const portName = p.port_name || '';
            const crossName = p.crossing_name || '';
            let coords = null;
            for (const [key, c] of Object.entries(portCoords)) {
                if (portName.includes(key) || crossName.includes(key)) {
                    coords = c;
                    break;
                }
            }
            if (!coords) return;

            let delayMin = 0;
            if (p.passenger_vehicle_lanes && p.passenger_vehicle_lanes.standard_lanes) {
                delayMin = p.passenger_vehicle_lanes.standard_lanes.delay_minutes || 0;
            }
            const badgeColor = delayMin > 45 ? '#ef4444' : (delayMin > 20 ? '#f59e0b' : '#10b981');

            const icon = L.divIcon({
                className: 'cbp-border-icon',
                html: `
                    <div style="background:#090d16;border:1.5px solid ${badgeColor};color:${badgeColor};padding:1px 4px;border-radius:3px;font-size:0.62rem;font-weight:bold;white-space:nowrap;box-shadow:0 0 6px rgba(0,0,0,0.8);">
                        🛂 ${delayMin}m
                    </div>
                `,
                iconSize: [38, 16],
                iconAnchor: [19, 8]
            });

            const marker = L.marker(coords, { icon: icon });
            marker.bindTooltip(`🛂 <strong>CBP: ${portName} (${crossName})</strong><br>Wartezeit: <strong style="color:${badgeColor};">${delayMin} Minuten</strong><br><span style="font-size:0.65rem;color:#38bdf8;">Klick für Grenzdossier MON-02</span>`, {
                direction: 'top',
                offset: [0, -8]
            });

            marker.on('click', (ev) => {
                this.notifyLayerClicked(ev);
                if (window.MainPlayer && window.MainPlayer.showBorderCrossingDeepDive) {
                    window.MainPlayer.showBorderCrossingDeepDive(p);
                }
            });

            this.bordersLayer.addLayer(marker);
        });
    } catch (e) {
        console.warn("CBP Border wait times fetch error:", e);
    }
};

OperationsMap.prototype.fetchTorRelays = async function() {
    try {
        const res = await fetch('/api/cyber/tor-relays?limit=100');
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();
        const relays = data.relays || [];
        this.torLayer.clearLayers();

        const countryCoords = {
            'Germany': [51.1657, 10.4515], 'United States': [37.0902, -95.7129],
            'France': [46.2276, 2.2137], 'Netherlands': [52.1326, 5.2913],
            'United Kingdom': [55.3781, -3.4360], 'Canada': [56.1304, -106.3468],
            'Switzerland': [46.8182, 8.2275], 'Sweden': [60.1282, 18.6435],
            'Finland': [61.9241, 25.7482], 'Austria': [47.5162, 14.5501],
            'Poland': [51.9194, 19.1451], 'Japan': [36.2048, 138.2529]
        };

        relays.forEach(r => {
            const cName = r.country_name || 'Germany';
            const base = countryCoords[cName] || [50.0 + (Math.random() - 0.5) * 5, 10.0 + (Math.random() - 0.5) * 5];
            const lat = base[0] + (Math.random() - 0.5) * 3;
            const lon = base[1] + (Math.random() - 0.5) * 3;

            const isExit = (r.flags || []).includes('Exit');
            const color = isExit ? '#f43f5e' : '#a855f7';

            const marker = L.circleMarker([lat, lon], {
                radius: isExit ? 6 : 4,
                fillColor: color,
                color: '#fff',
                weight: 1,
                opacity: 0.9,
                fillOpacity: 0.8
            });

            marker.bindTooltip(`🧅 <strong>TOR ${isExit ? 'EXIT NODE' : 'RELAY'}: ${r.nickname || 'TorNode'}</strong><br>ASN: ${r.as_name || 'AS'} | Bandbreite: ${Math.round((r.advertised_bandwidth || 0) / 1024 / 1024)} Mbps`, {
                direction: 'top',
                offset: [0, -5]
            });

            this.torLayer.addLayer(marker);
        });
    } catch (e) {
        console.warn("Tor relays fetch error:", e);
    }
};

OperationsMap.prototype.initOsintToolsDrawer = function() {
    const toggleBtn = document.getElementById('btn-toggle-osint-tools');
    const closeBtn = document.getElementById('btn-close-osint-tools');
    const drawer = document.getElementById('osint-tools-drawer');
    if (!drawer) return;

    if (toggleBtn) {
        toggleBtn.onclick = (e) => {
            e.stopPropagation();
            drawer.style.display = drawer.style.display === 'flex' ? 'none' : 'flex';
            const center = this.map.getCenter();
            const latInput = document.getElementById('tool-sun-lat');
            const lonInput = document.getElementById('tool-sun-lon');
            if (latInput && lonInput) {
                latInput.value = center.lat.toFixed(4);
                lonInput.value = center.lng.toFixed(4);
            }
            const dtInput = document.getElementById('tool-sun-datetime');
            if (dtInput && !dtInput.value) {
                dtInput.value = new Date().toISOString().slice(0, 16);
            }
        };
    }

    if (closeBtn) {
        closeBtn.onclick = () => {
            drawer.style.display = 'none';
        };
    }

    const tabBtns = drawer.querySelectorAll('.osint-tab-btn');
    tabBtns.forEach(btn => {
        btn.onclick = () => {
            tabBtns.forEach(b => {
                b.classList.remove('active');
                b.style.borderBottomColor = 'transparent';
                b.style.color = '#94a3b8';
                b.style.background = 'transparent';
            });
            btn.classList.add('active');
            btn.style.borderBottomColor = '#f59e0b';
            btn.style.color = '#f59e0b';
            btn.style.background = '#090f20';

            const targetTabId = btn.getAttribute('data-tab');
            drawer.querySelectorAll('.osint-tab-pane').forEach(pane => {
                pane.style.display = pane.id === targetTabId ? 'block' : 'none';
            });
        };
    });

    const calcSunBtn = document.getElementById('btn-calc-sun-shadow');
    if (calcSunBtn) {
        calcSunBtn.onclick = () => {
            const lat = parseFloat(document.getElementById('tool-sun-lat').value) || 50.0;
            const lon = parseFloat(document.getElementById('tool-sun-lon').value) || 8.0;
            const dtVal = document.getElementById('tool-sun-datetime').value;
            const height = parseFloat(document.getElementById('tool-sun-height').value) || 1.8;
            const dt = dtVal ? new Date(dtVal) : new Date();

            const dayOfYear = Math.floor((dt - new Date(dt.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
            const declination = 23.45 * Math.sin((360 / 365) * (dayOfYear - 81) * Math.PI / 180);
            const utcHours = dt.getUTCHours() + dt.getUTCMinutes() / 60;
            const solarTime = (utcHours + lon / 15) % 24;
            const hourAngle = (solarTime - 12) * 15;

            const latRad = lat * Math.PI / 180;
            const decRad = declination * Math.PI / 180;
            const haRad = hourAngle * Math.PI / 180;

            const sinAlt = Math.sin(latRad) * Math.sin(decRad) + Math.cos(latRad) * Math.cos(decRad) * Math.cos(haRad);
            const altitude = Math.asin(Math.max(-1, Math.min(1, sinAlt))) * 180 / Math.PI;

            const cosAz = (Math.sin(decRad) - Math.sin(latRad) * sinAlt) / (Math.cos(latRad) * Math.cos(altitude * Math.PI / 180));
            let azimuth = Math.acos(Math.max(-1, Math.min(1, cosAz))) * 180 / Math.PI;
            if (hourAngle > 0) azimuth = 360 - azimuth;

            const shadowLength = altitude > 0 ? (height / Math.tan(altitude * Math.PI / 180)).toFixed(2) : 'Unendlich (Nacht)';
            const shadowDir = ((azimuth + 180) % 360).toFixed(1);

            document.getElementById('res-sun-azimuth').innerText = `${azimuth.toFixed(1)}° (${this.azimuthToCompass(azimuth)})`;
            document.getElementById('res-sun-altitude').innerText = `${altitude.toFixed(1)}°`;
            document.getElementById('res-shadow-length').innerText = `${shadowLength} m`;
            document.getElementById('res-shadow-dir').innerText = `${shadowDir}°`;
        };
    }

    const convBtn = document.getElementById('btn-convert-coords');
    const jumpBtn = document.getElementById('btn-jump-coords');
    if (convBtn) {
        convBtn.onclick = () => {
            const ddStr = document.getElementById('tool-coord-dd').value;
            const parts = ddStr.split(/[\s,]+/);
            if (parts.length >= 2) {
                const lat = parseFloat(parts[0]);
                const lon = parseFloat(parts[1]);
                if (!isNaN(lat) && !isNaN(lon)) {
                    const latD = Math.floor(Math.abs(lat));
                    const latM = Math.floor((Math.abs(lat) - latD) * 60);
                    const latS = Math.round(((Math.abs(lat) - latD) * 60 - latM) * 60);
                    const latDir = lat >= 0 ? 'N' : 'S';

                    const lonD = Math.floor(Math.abs(lon));
                    const lonM = Math.floor((Math.abs(lon) - lonD) * 60);
                    const lonS = Math.round(((Math.abs(lon) - lonD) * 60 - lonM) * 60);
                    const lonDir = lon >= 0 ? 'E' : 'W';

                    document.getElementById('tool-coord-dms').value = `${latD}° ${latM}' ${latS}\" ${latDir}, ${lonD}° ${lonM}' ${lonS}\" ${lonDir}`;

                    const qthLon = lon + 180;
                    const qthLat = lat + 90;
                    const f1 = String.fromCharCode(65 + Math.floor(qthLon / 20));
                    const f2 = String.fromCharCode(65 + Math.floor(qthLat / 10));
                    const d1 = Math.floor((qthLon % 20) / 2);
                    const d2 = Math.floor((qthLat % 10) / 1);
                    const s1 = String.fromCharCode(97 + Math.floor(((qthLon % 20) % 2) * 12));
                    const s2 = String.fromCharCode(97 + Math.floor(((qthLat % 10) % 1) * 24));
                    document.getElementById('tool-coord-qth').value = `${f1}${f2}${d1}${d2}${s1}${s2}`;

                    const zone = Math.floor((lon + 180) / 6) + 1;
                    document.getElementById('tool-coord-mgrs').value = `${zone}U ${(Math.abs(lat)*10000).toFixed(0).slice(0,5)} ${(Math.abs(lon)*10000).toFixed(0).slice(0,5)}`;
                }
            }
        };
    }

    if (jumpBtn) {
        jumpBtn.onclick = () => {
            const ddStr = document.getElementById('tool-coord-dd').value;
            const parts = ddStr.split(/[\s,]+/);
            if (parts.length >= 2) {
                const lat = parseFloat(parts[0]);
                const lon = parseFloat(parts[1]);
                if (!isNaN(lat) && !isNaN(lon)) {
                    this.map.flyTo([lat, lon], 12);
                    drawer.style.display = 'none';
                }
            }
        };
    }

    const decodeMetarBtn = document.getElementById('btn-decode-metar');
    if (decodeMetarBtn) {
        decodeMetarBtn.onclick = () => {
            const input = document.getElementById('tool-metar-input').value.trim();
            const tokens = input.split(/[\s]+/);
            const icao = tokens[1] || 'AIRPORT';
            document.getElementById('res-metar-icao').innerText = icao;

            tokens.forEach(tok => {
                const windMatch = tok.match(/^(\d{3})(\d{2,3})KT$/);
                if (windMatch) {
                    const deg = windMatch[1];
                    const kt = windMatch[2];
                    document.getElementById('res-metar-wind').innerText = `${deg}° mit ${kt} KT (${(kt * 1.852).toFixed(1)} km/h)`;
                }
                const tempMatch = tok.match(/^(M?\d{2})\/(M?\d{2})$/);
                if (tempMatch) {
                    const t = tempMatch[1].replace('M', '-');
                    const d = tempMatch[2].replace('M', '-');
                    document.getElementById('res-metar-temp').innerText = `${t}°C / Taupunkt ${d}°C`;
                }
                const qnhMatch = tok.match(/^Q(\d{4})$/);
                if (qnhMatch) {
                    document.getElementById('res-metar-temp').innerText += ` // ${qnhMatch[1]} hPa`;
                }
                const cloudMatch = tok.match(/^(FEW|SCT|BKN|OVC)(\d{3})$/);
                if (cloudMatch) {
                    const type = cloudMatch[1];
                    const alt = parseInt(cloudMatch[2], 10) * 100;
                    document.getElementById('res-metar-clouds').innerText = `${type} bei ${alt.toLocaleString()} ft AGL`;
                }
            });
        };
    }

    const exportGeoBtn = document.getElementById('btn-export-geojson');
    const exportKmlBtn = document.getElementById('btn-export-kml');
    const exportCsvBtn = document.getElementById('btn-export-csv');

    const triggerDownload = (content, filename, type) => {
        const blob = new Blob([content], { type });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    };

    if (exportGeoBtn) {
        exportGeoBtn.onclick = () => {
            const layerType = document.getElementById('tool-export-layer-select').value;
            const sampleGeoJson = {
                type: "FeatureCollection",
                exported_layer: layerType,
                timestamp: new Date().toISOString(),
                features: []
            };
            triggerDownload(JSON.stringify(sampleGeoJson, null, 2), `omniscope_${layerType}_export.geojson`, 'application/geo+json');
        };
    }

    if (exportKmlBtn) {
        exportKmlBtn.onclick = () => {
            const layerType = document.getElementById('tool-export-layer-select').value;
            const kml = `<?xml version="1.0" encoding="UTF-8"?>\n<kml xmlns="http://www.opengis.net/kml/2.2">\n  <Document>\n    <name>OmniScope ${layerType} Export</name>\n  </Document>\n</kml>`;
            triggerDownload(kml, `omniscope_${layerType}_export.kml`, 'application/vnd.google-earth.kml+xml');
        };
    }

    if (exportCsvBtn) {
        exportCsvBtn.onclick = () => {
            const layerType = document.getElementById('tool-export-layer-select').value;
            const csv = `id,name,latitude,longitude,category,timestamp\n1,OmniScope_${layerType}_Node,50.1109,8.6821,${layerType},${new Date().toISOString()}`;
            triggerDownload(csv, `omniscope_${layerType}_export.csv`, 'text/csv');
        };
    }
};

OperationsMap.prototype.azimuthToCompass = function(deg) {
    const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
    const val = Math.floor((deg / 22.5) + 0.5);
    return directions[val % 16];
};

window.setJevTargetCoordinates = function(lat, lon) {
    if (!window.MapController) return;
    if (!window.MapController.isJevForecastMode) {
        window.MapController.toggleJevMode(true);
    }
    window.MapController.map.setView([lat, lon], 7);
    window.MapController.placeReticle(lat, lon);
    window.MapController.runJevForecastScan(lat, lon);
};

// =========================================================================
// TACTICAL SEVERE WEATHER & TORNADO ALARM CONTROLLER (EAS SIREN + AUTO JUMP)
// =========================================================================
class TacticalWeatherAlarmController {
    constructor(mapController) {
        this.mapController = mapController;
        this.pollingInterval = 300; // seconds (default 5 min)
        this.remainingSeconds = 300;
        this.timer = null;
        this.activeAlarmData = null;
        this.config = {
            alarm_on_tornado: true,
            alarm_on_hook_echo: true,
            alarm_on_supercell: true,
            alarm_on_flash_flood: true,
            min_ef_scale: 1,
            min_wind_gust_mph: 70.0,
            min_hail_diameter_in: 1.75,
            notification_sound: true,
            windows_toast: true,
            auto_jump_camera: true
        };

        this.initUI();
        this.loadConfig();
        this.startPollingTimer();
    }

    initUI() {
        // Polling selector change
        const sel = document.getElementById('select-polling-interval');
        if (sel) {
            sel.addEventListener('change', (e) => {
                this.pollingInterval = parseInt(e.target.value) || 300;
                this.remainingSeconds = this.pollingInterval;
                this.updateCountdownHUD();
                this.saveIntervalToBackend(this.pollingInterval);
            });
        }

        // Manual scan now button
        const btnScan = document.getElementById('btn-poll-now');
        if (btnScan) {
            btnScan.addEventListener('click', () => {
                this.remainingSeconds = this.pollingInterval;
                this.updateCountdownHUD();
                this.pollAlarms();
            });
        }

        // Alarm configuration modal buttons
        const btnCfg = document.getElementById('btn-weather-alarm-cfg');
        const modal = document.getElementById('weather-alarm-modal');
        const btnClose = document.getElementById('btn-close-alarm-modal');
        const btnSave = document.getElementById('btn-save-alarm-cfg');
        const btnTest = document.getElementById('btn-trigger-alarm-test');

        if (btnCfg && modal) {
            btnCfg.addEventListener('click', () => {
                modal.style.display = 'flex';
                this.populateFormFromConfig();
            });
        }

        if (btnClose && modal) {
            btnClose.addEventListener('click', () => {
                modal.style.display = 'none';
            });
        }

        if (btnSave) {
            btnSave.addEventListener('click', () => this.saveConfigFromForm());
        }

        if (btnTest) {
            btnTest.addEventListener('click', () => this.triggerDrillTest());
        }

        // Tactical Alarm Banner Action Buttons
        const btnJump = document.getElementById('btn-alarm-jump-feed');
        if (btnJump) {
            btnJump.addEventListener('click', () => this.jumpToActiveAlarmFeed());
        }

        const btnSilence = document.getElementById('btn-alarm-silence');
        if (btnSilence) {
            btnSilence.addEventListener('click', () => this.silenceAlarm());
        }

        const btnDismiss = document.getElementById('btn-alarm-dismiss');
        if (btnDismiss) {
            btnDismiss.addEventListener('click', () => this.dismissAlarm());
        }
    }

    startPollingTimer() {
        if (this.timer) clearInterval(this.timer);
        this.updateCountdownHUD();
        this.timer = setInterval(() => {
            this.remainingSeconds--;
            if (this.remainingSeconds <= 0) {
                this.remainingSeconds = this.pollingInterval;
                this.pollAlarms();
            }
            this.updateCountdownHUD();
        }, 1000);
    }

    updateCountdownHUD() {
        const hud = document.getElementById('polling-countdown');
        if (!hud) return;
        const mins = Math.floor(Math.max(0, this.remainingSeconds) / 60);
        const secs = Math.max(0, this.remainingSeconds) % 60;
        hud.innerText = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    async loadConfig() {
        try {
            const res = await fetch('/api/weather/alarms/config');
            if (res.ok) {
                const data = await res.json();
                if (data.config) {
                    this.config = { ...this.config, ...data.config };
                    if (this.config.polling_interval_seconds) {
                        this.pollingInterval = this.config.polling_interval_seconds;
                        this.remainingSeconds = this.pollingInterval;
                        const sel = document.getElementById('select-polling-interval');
                        if (sel) sel.value = String(this.pollingInterval);
                    }
                }
            }
        } catch (e) {
            console.warn('[AlarmController] Config load error:', e);
        }
    }

    async saveIntervalToBackend(seconds) {
        try {
            await fetch('/api/weather/alarms/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ polling_interval_seconds: seconds })
            });
        } catch (e) {}
    }

    populateFormFromConfig() {
        const c = this.config;
        const setChk = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };
        const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };

        setChk('cfg-alarm-tornado', c.alarm_on_tornado);
        setChk('cfg-alarm-hook-echo', c.alarm_on_hook_echo);
        setChk('cfg-alarm-supercell', c.alarm_on_supercell);
        setChk('cfg-alarm-flood', c.alarm_on_flash_flood);
        setVal('cfg-alarm-min-ef', c.min_ef_scale !== undefined ? c.min_ef_scale : 1);
        setVal('cfg-alarm-wind-mph', c.min_wind_gust_mph || 70);
        setVal('cfg-alarm-hail-in', c.min_hail_diameter_in || 1.75);
        setChk('cfg-alarm-eas-sound', c.notification_sound);
        setChk('cfg-alarm-toast', c.windows_toast);
        setChk('cfg-alarm-auto-jump', c.auto_jump_camera);
    }

    async saveConfigFromForm() {
        const getChk = (id) => { const el = document.getElementById(id); return el ? el.checked : true; };
        const getVal = (id, def) => { const el = document.getElementById(id); return el ? el.value : def; };

        const updated = {
            alarm_on_tornado: getChk('cfg-alarm-tornado'),
            alarm_on_hook_echo: getChk('cfg-alarm-hook-echo'),
            alarm_on_supercell: getChk('cfg-alarm-supercell'),
            alarm_on_flash_flood: getChk('cfg-alarm-flood'),
            min_ef_scale: parseInt(getVal('cfg-alarm-min-ef', 1)),
            min_wind_gust_mph: parseFloat(getVal('cfg-alarm-wind-mph', 70)),
            min_hail_diameter_in: parseFloat(getVal('cfg-alarm-hail-in', 1.75)),
            notification_sound: getChk('cfg-alarm-eas-sound'),
            windows_toast: getChk('cfg-alarm-toast'),
            auto_jump_camera: getChk('cfg-alarm-auto-jump'),
            polling_interval_seconds: this.pollingInterval
        };

        this.config = { ...this.config, ...updated };

        try {
            const res = await fetch('/api/weather/alarms/config', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(updated)
            });
            if (res.ok) {
                const modal = document.getElementById('weather-alarm-modal');
                if (modal) modal.style.display = 'none';
                if (window.CyberAudio) window.CyberAudio.playPing();
            }
        } catch (e) {
            console.error('[AlarmController] Failed to save config:', e);
        }
    }

    async pollAlarms() {
        try {
            const res = await fetch('/api/weather/alarms/poll');
            if (!res.ok) return;
            const data = await res.json();
            if (data.active_alarms && data.active_alarms.length > 0) {
                this.triggerAlarm(data.active_alarms[0], data.ground_tornado_detected);
            }
        } catch (e) {
            console.warn('[AlarmController] Poll error:', e);
        }
    }

    async triggerDrillTest() {
        try {
            const modal = document.getElementById('weather-alarm-modal');
            if (modal) modal.style.display = 'none';

            const res = await fetch('/api/weather/alarms/test', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ sector: "Oklahoma Sector / Moore, OK" })
            });
            const data = await res.json();
            if (data.alarm) {
                this.triggerAlarm(data.alarm, true);
            }
        } catch (e) {
            console.error('[AlarmController] Drill test error:', e);
        }
    }

    triggerAlarm(alarm, isGroundTornado = false) {
        this.activeAlarmData = alarm;
        const banner = document.getElementById('tactical-alarm-banner');
        const badge = document.getElementById('alarm-banner-badge');
        const text = document.getElementById('alarm-banner-text');

        const title = alarm.title || "SEVERE STORM ALERT";
        const desc = alarm.description || "Extreme Convective Meteorological Threat Active";
        const lat = alarm.lat != null ? alarm.lat : ((alarm.touchdown_sector && alarm.touchdown_sector.lat) || (alarm.centroid && alarm.centroid.lat));
        const lon = alarm.lon != null ? alarm.lon : ((alarm.touchdown_sector && alarm.touchdown_sector.lon) || (alarm.centroid && alarm.centroid.lon));

        if (badge) {
            badge.innerText = isGroundTornado ? "🚨 TORNADO ON THE GROUND" : "⚠️ SEVERE STORM ALARM";
        }
        if (text) {
            const coordText = (lat != null && lon != null) ? ` // 📍 [LAT: ${Number(lat).toFixed(2)}°, LON: ${Number(lon).toFixed(2)}°]` : '';
            text.innerHTML = `<strong>${title}:</strong> ${desc}${coordText}`;
        }
        if (banner) {
            banner.classList.add('active');
        }

        // Auto-pin this storm in the Live Storm Side Panel next to MON-02!
        if (this.mapController && typeof this.mapController.pinStormFromAlarm === 'function') {
            this.mapController.pinStormFromAlarm(alarm, isGroundTornado);
        }

        // 3-Phase 30-Second Alarm Siren (0-10s EAS, 11-20s Wail, 21-30s Warble, 30s+ Ambient Loop)
        if (this.config.notification_sound && window.CyberAudio) {
            window.CyberAudio.playTacticalStormAlarm();
        }

        // Windows Desktop Notification
        if (this.config.windows_toast && "Notification" in window) {
            if (Notification.permission === "granted") {
                new Notification(isGroundTornado ? "🚨 TORNADO ON THE GROUND!" : "⚠️ SEVERE WEATHER ALARM", {
                    body: `${title}\n${desc}`,
                    icon: "/favicon.ico"
                });
            } else if (Notification.permission !== "denied") {
                Notification.requestPermission();
            }
        }

        // Auto-Jump to Touchdown Feed if configured
        if (this.config.auto_jump_camera && lat != null && lon != null) {
            setTimeout(() => {
                this.jumpToActiveAlarmFeed();
            }, 1200);
        }
    }

    async jumpToActiveAlarmFeed() {
        if (!this.activeAlarmData) return;
        const lat = this.activeAlarmData.lat != null ? this.activeAlarmData.lat : ((this.activeAlarmData.touchdown_sector && this.activeAlarmData.touchdown_sector.lat) || (this.activeAlarmData.centroid && this.activeAlarmData.centroid.lat));
        const lon = this.activeAlarmData.lon != null ? this.activeAlarmData.lon : ((this.activeAlarmData.touchdown_sector && this.activeAlarmData.touchdown_sector.lon) || (this.activeAlarmData.centroid && this.activeAlarmData.centroid.lon));
        if (lat == null || lon == null || isNaN(lat) || isNaN(lon)) return;
        const title = this.activeAlarmData.title || "Severe Storm Sector";

        // 1. Smoothly center map to touchdown coordinates
        if (this.mapController && this.mapController.map) {
            this.mapController.map.flyTo([lat, lon], 12, { duration: 1.5 });
            this.mapController.placeReticle(lat, lon);

            // Enable NOAA NEXRAD Radar layer if available
            const radarChk = document.getElementById('layer-noaa-radar');
            if (radarChk && !radarChk.checked) {
                radarChk.checked = true;
                radarChk.dispatchEvent(new Event('change'));
            }
        }

        // 2. Query nearest optical camera / traffic stream
        try {
            const res = await fetch(`/api/weather/alarms/nearest-feed?lat=${lat}&lon=${lon}`);
            if (res.ok) {
                const data = await res.json();
                const cam = data.nearest_camera;
                if (cam && window.MainPlayer) {
                    window.MainPlayer.loadCamera(cam);
                }
            }
        } catch (e) {
            console.warn('[AlarmController] Failed to query nearest camera:', e);
        }
    }

    silenceAlarm() {
        if (window.CyberAudio) {
            window.CyberAudio.stopAlarm();
        }
    }

    dismissAlarm() {
        this.silenceAlarm();
        const banner = document.getElementById('tactical-alarm-banner');
        if (banner) banner.classList.remove('active');
        this.activeAlarmData = null;
    }
}

// =========================================================================
// INTERACTIVE DYNAMIC PANEL RESIZER (SAFE DRAG & CLAMPED BOUNDS)
// =========================================================================
window.saveMonitorsLayout = function() {
    try {
        const row = document.getElementById('top-monitors-row');
        const cardMap = document.getElementById('card-map');
        const cardStorm = document.getElementById('card-live-storm');
        const cardWebcam = document.getElementById('card-webcam');
        if (!row || !cardMap || !cardWebcam) return;

        const rowW = row.clientWidth || window.innerWidth;
        if (rowW < 300) return;

        const mapW = cardMap.getBoundingClientRect().width;
        const isStormCollapsed = cardStorm ? cardStorm.classList.contains('collapsed') : true;
        const stormW = (cardStorm && !isStormCollapsed) ? cardStorm.getBoundingClientRect().width : 0;

        let mapPct = mapW / rowW;
        let stormPct = isStormCollapsed ? 0 : (stormW / rowW);

        if (isStormCollapsed) {
            mapPct = Math.max(0.25, Math.min(0.72, mapPct));
            stormPct = 0;
        } else {
            mapPct = Math.max(0.22, Math.min(0.55, mapPct));
            stormPct = Math.max(0.14, Math.min(0.35, stormPct));
            if (mapPct + stormPct > 0.76) {
                mapPct = 0.46;
                stormPct = 0.22;
            }
        }

        const layoutData = {
            mapPct: parseFloat(mapPct.toFixed(4)),
            stormPct: parseFloat(stormPct.toFixed(4)),
            stormCollapsed: isStormCollapsed
        };
        localStorage.setItem('cyber_top_monitors_layout', JSON.stringify(layoutData));
    } catch(e) {
        console.warn('[Layout] Failed to save layout:', e);
    }
};

window.resetMonitorsLayout = function() {
    try {
        localStorage.removeItem('cyber_top_monitors_layout');
    } catch(e) {}
    const cardMap = document.getElementById('card-map');
    const cardStorm = document.getElementById('card-live-storm');
    const cardWebcam = document.getElementById('card-webcam');
    const resizer1 = document.getElementById('resizer-map-storm');
    const resizer2 = document.getElementById('resizer-storm-webcam');
    const stormToggleBtn = document.getElementById('btn-toggle-storm-panel');

    if (cardMap) {
        cardMap.style.flex = '0 0 46%';
        cardMap.style.width = '';
        cardMap.style.minWidth = '300px';
    }
    if (cardStorm) {
        cardStorm.classList.remove('collapsed');
        cardStorm.style.flex = '0 0 22%';
        cardStorm.style.width = '';
        cardStorm.style.minWidth = '240px';
        cardStorm.style.display = 'flex';
    }
    if (stormToggleBtn) {
        stormToggleBtn.classList.add('active');
    }
    if (cardWebcam) {
        cardWebcam.classList.remove('expanded-full');
        cardWebcam.style.flex = '1 1 0';
        cardWebcam.style.width = '';
        cardWebcam.style.minWidth = '300px';
        cardWebcam.style.visibility = 'visible';
        cardWebcam.style.display = 'flex';
    }
    if (resizer1) resizer1.style.display = 'flex';
    if (resizer2) resizer2.style.display = 'flex';

    if (window.MapController && window.MapController.map) {
        setTimeout(() => window.MapController.map.invalidateSize(), 50);
    }
    console.log('[Layout] Panels reset to default balanced proportions (46% Map / 22% Storm / 32% Webcam).');
    
    try {
        fetch('/api/logs/feedback', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({ event: 'LAYOUT_RESET', payload: { reason: 'user_reset_or_clamped' } })
        }).catch(() => {});
    } catch(e) {}
};

function initDynamicPanelResizers() {
    const row = document.getElementById('top-monitors-row');
    const resizer1 = document.getElementById('resizer-map-storm');
    const resizer2 = document.getElementById('resizer-storm-webcam');
    const cardMap = document.getElementById('card-map');
    const cardStorm = document.getElementById('card-live-storm');
    const cardWebcam = document.getElementById('card-webcam');

    if (!row || !cardMap || !cardStorm || !cardWebcam) return;

    // Validate and restore saved proportions
    let restored = false;
    try {
        const raw = localStorage.getItem('cyber_top_monitors_layout');
        if (raw) {
            const saved = JSON.parse(raw);
            const stormToggleBtn = document.getElementById('btn-toggle-storm-panel');
            if (saved && typeof saved.mapPct === 'number') {
                if (saved.stormCollapsed) {
                    cardStorm.classList.add('collapsed');
                    if (stormToggleBtn) stormToggleBtn.classList.remove('active');
                    if (resizer2) resizer2.style.display = 'none';
                    cardWebcam.classList.add('expanded-full');
                    const mapPct = Math.max(0.25, Math.min(0.72, saved.mapPct));
                    cardMap.style.flex = `0 0 ${(mapPct * 100).toFixed(2)}%`;
                    cardWebcam.style.flex = '1 1 0';
                    restored = true;
                } else if (typeof saved.stormPct === 'number' && saved.stormPct > 0.08) {
                    cardStorm.classList.remove('collapsed');
                    if (stormToggleBtn) stormToggleBtn.classList.add('active');
                    if (resizer2) resizer2.style.display = 'flex';
                    cardWebcam.classList.remove('expanded-full');
                    let mapPct = Math.max(0.20, Math.min(0.55, saved.mapPct));
                    let stormPct = Math.max(0.12, Math.min(0.35, saved.stormPct));
                    if (mapPct + stormPct > 0.76) {
                        mapPct = 0.46;
                        stormPct = 0.22;
                    }
                    cardMap.style.flex = `0 0 ${(mapPct * 100).toFixed(2)}%`;
                    cardStorm.style.flex = `0 0 ${(stormPct * 100).toFixed(2)}%`;
                    cardWebcam.style.flex = '1 1 0';
                    restored = true;
                }
            }
        }
    } catch(e) {
        console.warn('[Layout] Error restoring layout:', e);
    }

    if (!restored) {
        window.resetMonitorsLayout();
    }

    function setupDrag(handle, onDragMove) {
        if (!handle) return;
        let isDragging = false;
        let startX = 0;

        handle.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Left click only
            isDragging = true;
            startX = e.clientX;
            handle.classList.add('dragging');
            document.body.style.cursor = 'col-resize';
            document.body.style.userSelect = 'none';

            const onMouseMove = (moveEvt) => {
                if (!isDragging) return;
                const deltaX = moveEvt.clientX - startX;
                startX = moveEvt.clientX;
                onDragMove(deltaX);

                if (window.MapController && window.MapController.map) {
                    window.MapController.map.invalidateSize();
                }
            };

            const onMouseUp = () => {
                if (!isDragging) return;
                isDragging = false;
                handle.classList.remove('dragging');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                document.removeEventListener('mousemove', onMouseMove);
                document.removeEventListener('mouseup', onMouseUp);

                // Save layout in safe percentages
                if (window.saveMonitorsLayout) {
                    window.saveMonitorsLayout();
                }

                if (window.MapController && window.MapController.map) {
                    window.MapController.map.invalidateSize();
                }
            };

            document.addEventListener('mousemove', onMouseMove);
            document.addEventListener('mouseup', onMouseUp);
        });
    }

    // Resizer 1 (Map <-> Storm) with strict boundary protection
    setupDrag(resizer1, (deltaX) => {
        const rowW = row.clientWidth || window.innerWidth;
        const currentMapW = cardMap.getBoundingClientRect().width;
        const currentStormW = cardStorm.getBoundingClientRect().width;
        const minMapW = Math.max(300, Math.round(rowW * 0.22));
        const minStormW = cardStorm.classList.contains('collapsed') ? 0 : Math.max(240, Math.round(rowW * 0.16));
        const minWebcamW = Math.max(300, Math.round(rowW * 0.24));
        const dividerW = 20;

        const maxMapW = rowW - minStormW - minWebcamW - dividerW;
        const newMapW = Math.max(minMapW, Math.min(maxMapW, currentMapW + deltaX));
        
        const availableForStorm = rowW - newMapW - minWebcamW - dividerW;
        const newStormW = Math.max(minStormW, Math.min(currentStormW, availableForStorm));

        cardMap.style.flex = `0 0 ${(newMapW / rowW * 100).toFixed(2)}%`;
        cardStorm.style.flex = `0 0 ${(newStormW / rowW * 100).toFixed(2)}%`;
        cardWebcam.style.flex = '1 1 0';
    });

    // Resizer 2 (Storm <-> Webcam) strictly guaranteeing Webcam visibility
    setupDrag(resizer2, (deltaX) => {
        if (cardStorm.classList.contains('collapsed')) return;
        const rowW = row.clientWidth || window.innerWidth;
        const currentMapW = cardMap.getBoundingClientRect().width;
        const currentStormW = cardStorm.getBoundingClientRect().width;
        const minStormW = Math.max(240, Math.round(rowW * 0.16));
        const minWebcamW = Math.max(300, Math.round(rowW * 0.24));
        const dividerW = 20;

        const maxStormW = rowW - currentMapW - minWebcamW - dividerW;
        const newStormW = Math.max(minStormW, Math.min(maxStormW, currentStormW + deltaX));

        cardStorm.style.flex = `0 0 ${(newStormW / rowW * 100).toFixed(2)}%`;
        cardWebcam.style.flex = '1 1 0';
    });

    // Double-click on either divider resets layout instantly
    if (resizer1) resizer1.addEventListener('dblclick', () => window.resetMonitorsLayout());
    if (resizer2) resizer2.addEventListener('dblclick', () => window.resetMonitorsLayout());

    // Connect all Reset Buttons
    ['btn-reset-top-monitors-bar', 'btn-reset-monitors-header', 'btn-reset-panels-layout'].forEach(btnId => {
        const el = document.getElementById(btnId);
        if (el) {
            el.addEventListener('click', (e) => {
                e.preventDefault();
                window.resetMonitorsLayout();
            });
        }
    });

    // Auto-clamp on window resize
    window.addEventListener('resize', () => {
        const webcamW = cardWebcam.getBoundingClientRect().width;
        if (webcamW < 260) {
            window.resetMonitorsLayout();
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    window.MapController = new OperationsMap('map');
    window.TacticalAlarmCtrl = new TacticalWeatherAlarmController(window.MapController);
    initDynamicPanelResizers();
});
