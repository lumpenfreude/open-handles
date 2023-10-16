import { env } from "process";

const hetznerProvider = {
  createSubdomain: async (
    domainName: string,
    domainValue: string,
    zoneName: string,
    type: string
  ) => {
    const zones = env.DOMAINS_HETZNER?.split(",");
    const zoneId = zones?.find((el) => el.startsWith(zoneName))?.split(":")[1];

    const response = await fetch(
      `https://dns.hetzner.com/api/v1/records`,
      {
        body: JSON.stringify({
          value: domainValue,
					ttl: 60,
					type,
          name: domainName,
					zone_id: zoneName,
        }),
        headers: {
          "Auth-API-Token": `${env.HETZNER_SECRET || ""}`,
          "Content-Type": "application/json; charset=utf-8",
        },
        method: "POST",
      }
    );

    type HetznerResponse = {
      success?: boolean;
    };
    const { success } = (await response.json()) as HetznerResponse;
    return response.status === 200 && success;
  },
};

export default hetznerProvider;
