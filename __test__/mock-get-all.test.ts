import { Client } from "@hubspot/api-client";

jest.mock("@hubspot/api-client/lib/src/discovery/crm/products/ProductsDiscovery", () => {
    return {
        ...jest.requireActual("@hubspot/api-client/lib/src/discovery/crm/products/ProductsDiscovery"),
        ProductsDiscovery: jest.fn().mockImplementation(() => {
            return {
                getAll: jest.fn().mockImplementation(() => {
                    return [
                        {
                            id: 1,
                            properties: {
                                name: 'existing-product-name'
                            }
                        }
                    ]
                })
            }
        })
    }
});

it('can mock getAll', async () => {
    const client = new Client({accessToken: 'dummy'});
    const results = await client.crm.products.getAll()

    expect(results).toStrictEqual([ { id: 1, properties: { name: 'existing-product-name' } } ]);
})