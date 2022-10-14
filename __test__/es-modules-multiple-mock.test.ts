import { Client } from "@hubspot/api-client";
import { PromiseBasicApi } from "@hubspot/api-client/lib/codegen/crm/products/types/PromiseAPI";
import { ProductsDiscovery } from "@hubspot/api-client/lib/src/discovery/crm/products/ProductsDiscovery";

const mockCreate = jest.fn()
const mockUpdate = jest.fn()

jest.mock('@hubspot/api-client/lib/codegen/crm/products/types/PromiseAPI', () => {
    const actual = jest.requireActual('@hubspot/api-client/lib/codegen/crm/products/types/PromiseAPI');
  
    return {
        __esModule: true,
        ...actual,
        PromiseBasicApi: jest.fn().mockImplementation(() => {
            return {
                create: mockCreate,
                update: mockUpdate,
            }
        })
    };
});

jest.mock('@hubspot/api-client/lib/src/discovery/crm/products/ProductsDiscovery', () => {
    const actual = jest.requireActual('@hubspot/api-client/lib/src/discovery/crm/products/ProductsDiscovery');
  
    return {
        __esModule: true,
        ...actual,
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
    };
});

it('can mock multiple things at once', async () => {
    const client = new Client({accessToken: 'dummy'});
    const product = {properties: {name: 'non-existing-product-name'}};

    await client.crm.products.basicApi.create(product);

    expect(mockUpdate).not.toHaveBeenCalled();
    expect(mockCreate).toHaveBeenCalledWith(product);
})