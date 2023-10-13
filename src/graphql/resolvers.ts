import { ApolloServerExpressConfig } from 'apollo-server-express/src/ApolloServer';
import { PubSub } from 'graphql-subscriptions';

const pubsub = new PubSub();

const db = {
  "books": [
    {
      "title": "Title",
      "author": "Author"
    }
  ],
  "profile": {
    "id": "id",
    "name": "Name",
    "email": "email@email.com"
  },
  "users": [
    {
      "id": "1",
      "name": "User 1",
      "email": "email@email.com"
    },
    {
      "id": "2",
      "name": "User 2",
      "email": "email@email.com"
    },
    {
      "id": "3",
      "name": "User 3",
      "email": "email@email.com"
    }
  ],
  "messages": [
    {
      id: "1",
      "text": "text"
    }
  ],
};

export const resolvers: ApolloServerExpressConfig['resolvers'] = {
  Subscription: {
    messageSent: {
      subscribe: () => pubsub.asyncIterator(['SEND_MESSAGE'])
    },
  },
  Mutation: {
    sendMessage: (_, { text }) => {
      const id = Math.random().toString();
      db.messages.push({ text, id });
      pubsub.publish('SEND_MESSAGE', { messageSent: db.messages });
      return db.messages;
    },
    editProfile: (_, { email, name }) => {
      return Object.assign(db.profile, { email, name })
    }
  },
  Query: {
    profile: () => {
      return db.profile;
    },
    users: (_, { filters }) => {
      if (!filters) return db.users;
      return db.users?.filter((i) => filters.ids?.includes(i.id));
    },
    messages: () => {
      return db.messages;
    },
  },
};
