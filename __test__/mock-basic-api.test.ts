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

it('can mock basicApi', async () => {
    const client = new Client({accessToken: 'dummy'});
    const product = {properties: {name: 'non-existing-product-name'}};

    await client.crm.products.basicApi.create(product);

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalledWith(product);
})