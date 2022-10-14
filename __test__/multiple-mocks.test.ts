import { Client } from "@hubspot/api-client";
const mockCreate = jest.fn()
const mockUpdate = jest.fn()

jest.mock("@hubspot/api-client/lib/codegen/crm/products/types/PromiseAPI", () => {
    return {
        ...jest.requireActual("@hubspot/api-client/lib/codegen/crm/products/types/PromiseAPI"),
        PromiseBasicApi: jest.fn().mockImplementation(() => {
            return {
                create: mockCreate,
                update: mockUpdate,
            }
        })
    }
})

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

it('can mock basicApi', async () => {
    const client = new Client({accessToken: 'dummy'});
    const product = {properties: {name: 'non-existing-product-name'}};

    await client.crm.products.basicApi.create(product);

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalledWith(product);
})

it('can mock getAll', async () => {
    const client = new Client({accessToken: 'dummy'});
    const results = await client.crm.products.getAll()

    expect([ { id: 1, properties: { name: 'existing-product-name' } } ]).not.toHaveBeenCalled();
})