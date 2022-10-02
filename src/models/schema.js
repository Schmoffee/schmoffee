export const schema = {
  models: {
    Option: {
      name: 'Option',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        option_type: {
          name: 'option_type',
          isArray: false,
          type: {
            enum: 'OptionType',
          },
          isRequired: true,
          attributes: [],
        },
        price: {
          name: 'price',
          isArray: false,
          type: 'Float',
          isRequired: true,
          attributes: [],
        },
        image: {
          name: 'image',
          isArray: false,
          type: 'AWSURL',
          isRequired: false,
          attributes: [],
        },
        is_in_stock: {
          name: 'is_in_stock',
          isArray: false,
          type: 'Boolean',
          isRequired: true,
          attributes: [],
        },
        itemID: {
          name: 'itemID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Options',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byItem',
            fields: ['itemID'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    PastOrder: {
      name: 'PastOrder',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        items: {
          name: 'items',
          isArray: true,
          type: {
            nonModel: 'OrderItem',
          },
          isRequired: true,
          attributes: [],
          isArrayNullable: false,
        },
        final_status: {
          name: 'final_status',
          isArray: false,
          type: {
            enum: 'OrderStatus',
          },
          isRequired: true,
          attributes: [],
        },
        total: {
          name: 'total',
          isArray: false,
          type: 'Float',
          isRequired: true,
          attributes: [],
        },
        order_info: {
          name: 'order_info',
          isArray: false,
          type: {
            nonModel: 'OrderInfo',
          },
          isRequired: true,
          attributes: [],
        },
        cafeID: {
          name: 'cafeID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        userID: {
          name: 'userID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'PastOrders',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byCafe',
            fields: ['cafeID'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byUser',
            fields: ['userID'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    CurrentOrder: {
      name: 'CurrentOrder',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        items: {
          name: 'items',
          isArray: true,
          type: {
            nonModel: 'OrderItem',
          },
          isRequired: true,
          attributes: [],
          isArrayNullable: true,
        },
        total: {
          name: 'total',
          isArray: false,
          type: 'Float',
          isRequired: true,
          attributes: [],
        },
        order_info: {
          name: 'order_info',
          isArray: false,
          type: {
            nonModel: 'OrderInfo',
          },
          isRequired: true,
          attributes: [],
        },
        user: {
          name: 'user',
          isArray: false,
          type: {
            model: 'User',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetName: 'userID',
          },
        },
        cafe: {
          name: 'cafe',
          isArray: false,
          type: {
            model: 'Cafe',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'BELONGS_TO',
            targetName: 'cafeID',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'CurrentOrders',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byCafe',
            fields: ['cafeID'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    User: {
      name: 'User',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        is_signed_in: {
          name: 'is_signed_in',
          isArray: false,
          type: 'Boolean',
          isRequired: false,
          attributes: [],
        },
        phone: {
          name: 'phone',
          isArray: false,
          type: 'AWSPhone',
          isRequired: false,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        payment_method: {
          name: 'payment_method',
          isArray: false,
          type: 'String',
          isRequired: false,
          attributes: [],
        },
        latitude: {
          name: 'latitude',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        longitude: {
          name: 'longitude',
          isArray: false,
          type: 'Float',
          isRequired: false,
          attributes: [],
        },
        is_locatable: {
          name: 'is_locatable',
          isArray: false,
          type: 'Boolean',
          isRequired: true,
          attributes: [],
        },
        ratings: {
          name: 'ratings',
          isArray: true,
          type: {
            model: 'Rating',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'userID',
          },
        },
        past_orders: {
          name: 'past_orders',
          isArray: true,
          type: {
            model: 'PastOrder',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'userID',
          },
        },
        current_order: {
          name: 'current_order',
          isArray: false,
          type: {
            model: 'CurrentOrder',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: 'user',
            targetName: 'userCurrentOrderId',
          },
        },
        the_usual: {
          name: 'the_usual',
          isArray: false,
          type: {
            model: 'PastOrder',
          },
          isRequired: false,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: 'id',
            targetName: 'userTheUsualId',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        userCurrentOrderId: {
          name: 'userCurrentOrderId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
        userTheUsualId: {
          name: 'userTheUsualId',
          isArray: false,
          type: 'ID',
          isRequired: false,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'Users',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Rating: {
      name: 'Rating',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        rating: {
          name: 'rating',
          isArray: false,
          type: 'Float',
          isRequired: true,
          attributes: [],
        },
        cafeID: {
          name: 'cafeID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        userID: {
          name: 'userID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        itemID: {
          name: 'itemID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        order: {
          name: 'order',
          isArray: false,
          type: {
            model: 'PastOrder',
          },
          isRequired: true,
          attributes: [],
          association: {
            connectionType: 'HAS_ONE',
            associatedWith: 'id',
            targetName: 'ratingOrderId',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        ratingOrderId: {
          name: 'ratingOrderId',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
      },
      syncable: true,
      pluralName: 'Ratings',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byCafe',
            fields: ['cafeID'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byUser',
            fields: ['userID'],
          },
        },
        {
          type: 'key',
          properties: {
            name: 'byItem',
            fields: ['itemID'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Cafe: {
      name: 'Cafe',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        email: {
          name: 'email',
          isArray: false,
          type: 'AWSEmail',
          isRequired: true,
          attributes: [],
        },
        latitude: {
          name: 'latitude',
          isArray: false,
          type: 'Float',
          isRequired: true,
          attributes: [],
        },
        longitude: {
          name: 'longitude',
          isArray: false,
          type: 'Float',
          isRequired: true,
          attributes: [],
        },
        opening_hours: {
          name: 'opening_hours',
          isArray: true,
          type: 'AWSTime',
          isRequired: true,
          attributes: [],
          isArrayNullable: false,
        },
        is_open: {
          name: 'is_open',
          isArray: false,
          type: 'Boolean',
          isRequired: true,
          attributes: [],
        },
        opening_days: {
          name: 'opening_days',
          isArray: true,
          type: {
            enum: 'Day',
          },
          isRequired: true,
          attributes: [],
          isArrayNullable: true,
        },
        image: {
          name: 'image',
          isArray: false,
          type: 'AWSURL',
          isRequired: false,
          attributes: [],
        },
        description: {
          name: 'description',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        digital_queue: {
          name: 'digital_queue',
          isArray: false,
          type: 'AWSJSON',
          isRequired: true,
          attributes: [],
        },
        menu: {
          name: 'menu',
          isArray: true,
          type: {
            model: 'Item',
          },
          isRequired: true,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'cafeID',
          },
        },
        past_orders: {
          name: 'past_orders',
          isArray: true,
          type: {
            model: 'PastOrder',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'cafeID',
          },
        },
        current_orders: {
          name: 'current_orders',
          isArray: true,
          type: {
            model: 'CurrentOrder',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'cafe',
          },
        },
        ratings: {
          name: 'ratings',
          isArray: true,
          type: {
            model: 'Rating',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'cafeID',
          },
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Cafes',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
    Item: {
      name: 'Item',
      fields: {
        id: {
          name: 'id',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        price: {
          name: 'price',
          isArray: false,
          type: 'Float',
          isRequired: true,
          attributes: [],
        },
        image: {
          name: 'image',
          isArray: false,
          type: 'AWSURL',
          isRequired: false,
          attributes: [],
        },
        is_common: {
          name: 'is_common',
          isArray: false,
          type: 'Boolean',
          isRequired: true,
          attributes: [],
        },
        is_in_stock: {
          name: 'is_in_stock',
          isArray: false,
          type: 'Boolean',
          isRequired: true,
          attributes: [],
        },
        preparation_time: {
          name: 'preparation_time',
          isArray: false,
          type: 'Int',
          isRequired: true,
          attributes: [],
        },
        cafeID: {
          name: 'cafeID',
          isArray: false,
          type: 'ID',
          isRequired: true,
          attributes: [],
        },
        ratings: {
          name: 'ratings',
          isArray: true,
          type: {
            model: 'Rating',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'itemID',
          },
        },
        options: {
          name: 'options',
          isArray: true,
          type: {
            model: 'Option',
          },
          isRequired: false,
          attributes: [],
          isArrayNullable: true,
          association: {
            connectionType: 'HAS_MANY',
            associatedWith: 'itemID',
          },
        },
        type: {
          name: 'type',
          isArray: false,
          type: {
            enum: 'ItemType',
          },
          isRequired: false,
          attributes: [],
        },
        createdAt: {
          name: 'createdAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
        updatedAt: {
          name: 'updatedAt',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
          isReadOnly: true,
        },
      },
      syncable: true,
      pluralName: 'Items',
      attributes: [
        {
          type: 'model',
          properties: {},
        },
        {
          type: 'key',
          properties: {
            name: 'byCafe',
            fields: ['cafeID'],
          },
        },
        {
          type: 'auth',
          properties: {
            rules: [
              {
                allow: 'public',
                operations: ['create', 'update', 'delete', 'read'],
              },
            ],
          },
        },
      ],
    },
  },
  enums: {
    ItemType: {
      name: 'ItemType',
      values: ['COFFEE', 'COLD_DRINKS', 'SNACKS'],
    },
    OptionType: {
      name: 'OptionType',
      values: ['BEAN', 'SYRUP', 'MILK'],
    },
    OrderStatus: {
      name: 'OrderStatus',
      values: ['ACCEPTED', 'REJECTED', 'PREPARING', 'READY', 'COLLECTED', 'RECEIVED'],
    },
    Day: {
      name: 'Day',
      values: ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY'],
    },
  },
  nonModels: {
    OrderItem: {
      name: 'OrderItem',
      fields: {
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        price: {
          name: 'price',
          isArray: false,
          type: 'Float',
          isRequired: true,
          attributes: [],
        },
        options: {
          name: 'options',
          isArray: true,
          type: {
            nonModel: 'OrderOption',
          },
          isRequired: true,
          attributes: [],
          isArrayNullable: true,
        },
      },
    },
    OrderOption: {
      name: 'OrderOption',
      fields: {
        name: {
          name: 'name',
          isArray: false,
          type: 'String',
          isRequired: true,
          attributes: [],
        },
        price: {
          name: 'price',
          isArray: false,
          type: 'Float',
          isRequired: true,
          attributes: [],
        },
        option_type: {
          name: 'option_type',
          isArray: false,
          type: {
            enum: 'OptionType',
          },
          isRequired: true,
          attributes: [],
        },
      },
    },
    OrderInfo: {
      name: 'OrderInfo',
      fields: {
        status: {
          name: 'status',
          isArray: false,
          type: {
            enum: 'OrderStatus',
          },
          isRequired: true,
          attributes: [],
        },
        accepted_time: {
          name: 'accepted_time',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
        },
        rejected_time: {
          name: 'rejected_time',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
        },
        ready_time: {
          name: 'ready_time',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
        },
        collected_time: {
          name: 'collected_time',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
        },
        received_time: {
          name: 'received_time',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
        },
        scheduled_times: {
          name: 'scheduled_times',
          isArray: true,
          type: 'AWSDateTime',
          isRequired: true,
          attributes: [],
          isArrayNullable: false,
        },
        preparing_time: {
          name: 'preparing_time',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: false,
          attributes: [],
        },
        sent_time: {
          name: 'sent_time',
          isArray: false,
          type: 'AWSDateTime',
          isRequired: true,
          attributes: [],
        },
      },
    },
  },
  version: '46f2c0c3ca9c979d51021b7e7e5409ee',
};
