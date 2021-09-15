import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  FlatList,
  Image,
} from 'react-native';
import { useQuery, gql } from '@apollo/client';

// Create an executable query
const GET_PRODUCTS = gql`
  query getProducts {
    products(first: 10, channel: "default-channel") {
      edges {
        node {
          id
          name
          description
          thumbnail {
            url
          }
        }
      }
    }
  }
`;

export default function Products() {
  const { loading, data } = useQuery(GET_PRODUCTS);

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <Text>Loading</Text>
      ) : (
        <FlatList
          data={data.products.edges}
          ListHeaderComponent={() => <Text style={styles.title}>Products</Text>}
          renderItem={({ item }) => (
            <View style={styles.product}>
              <Image
                source={{ uri: item.node.thumbnail.url }}
                style={{ height: 150, width: 150 }}
              />
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                }}
              >
                {item.node.name}
              </Text>
              <Text>$4.50</Text>
            </View>
          )}
          numColumns={2}
          keyExtractor={(item) => item.node.id}
        />
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  title: {
    width: '100%',
    textAlign: 'center',
    fontSize: 20,
    padding: 20,
  },
  product: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
});
