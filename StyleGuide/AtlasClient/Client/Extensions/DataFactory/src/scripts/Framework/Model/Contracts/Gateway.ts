import BaseEncodable = require("./BaseEncodable");

export class Encodable extends BaseEncodable.BaseEncodable {
    public name: string;

    constructor(name: string) {
        // Ideally the toUpperCase here would match CLR's String.ToUpperInvariant()
        // which is in line with string.Equals(other, StringComparison.OrdinalIgnoreCase)
        // used for data factory identifiers. However, it is up to browser implementation,
        // but this is the best we have.
        super(BaseEncodable.EncodableType.GATEWAY, name.toUpperCase());
        this.name = name;
    }
}

export enum GatewayStatus {
    Online,
    NeedRegistration,
    Offline,
    Upgrading,
    Other
}

export enum GatewayVersionStatus {
    None,
    UpToDate,
    NewVersionAvailable,
    Expiring,
    Expired,
    Other
};

/**
 * The helper for gateway data.
 */
export class GatewayDataHelper {
    /**
     * Parse the status from string
     *
     * @param statusString The string to parse
     * @return The status
     */
    public static parseStatus(statusString: string): GatewayStatus {
        if (statusString.toLowerCase() === "online") { return GatewayStatus.Online; }
        if (statusString.toLowerCase() === "needregistration") { return GatewayStatus.NeedRegistration; }
        if (statusString.toLowerCase() === "offline") { return GatewayStatus.Offline; }
        return GatewayStatus.Other;
    }

   /**
    * Parse the version status from string
    *
    * @param statusString The string to parse
    * @return The version status
    */
    public static parseVersionStatus(statusString: string): GatewayVersionStatus {
        if (statusString.toLowerCase() === "none") { return GatewayVersionStatus.None; }
        if (statusString.toLowerCase() === "uptodate") { return GatewayVersionStatus.UpToDate; }
        if (statusString.toLowerCase() === "newversionavailable") { return GatewayVersionStatus.NewVersionAvailable; }
        if (statusString.toLowerCase() === "expiring") { return GatewayVersionStatus.Expiring; }
        if (statusString.toLowerCase() === "expired") { return GatewayVersionStatus.Expired; }
        return GatewayVersionStatus.Other;
    }

    /**
     * Check whether the gateway need update
     *
     * @param statusString The version state string
     * @return whether the gateway need update or not
     */
    public static needUpdate(gateway: MdpExtension.DataModels.Gateway): boolean {
        let gatewayStatus = GatewayDataHelper.parseVersionStatus(gateway.properties().versionStatus());
        if (gatewayStatus === GatewayVersionStatus.Expired || gatewayStatus === GatewayVersionStatus.Expiring || gatewayStatus === GatewayVersionStatus.NewVersionAvailable) {
            return true;
        } else {
            return false;
        }
    }
}
