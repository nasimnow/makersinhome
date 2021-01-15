import React, { useEffect, useState, useDisclosure } from "react";
import styles from "./css/store.module.css";
import { SearchIcon } from "@chakra-ui/icons";
import { useHistory, Link, withRouter } from "react-router-dom";
import { getStoreProducts, getStoreDataAll } from "../../api/custStoreAPI";
import { productImagesRoot } from "../../config";
import { updateStoreViews } from "../../api/custAnalyticsAPI";
import {
  SimpleGrid,
  Input,
  InputGroup,
  InputLeftElement,
  Button,
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from "@chakra-ui/react";

const Store = (props) => {
  let history = useHistory();
  const storeLink = props.match.params.storelink;
  const [storeData, setStoreData] = useState({});
  const [storeProducts, setStoreProducts] = useState([]);
  const [storeCategories, setStoreCategories] = useState([]);
  const [catSelected, setCatSelected] = useState("all");
  const [isOpen, setIsOpen] = useState(false);
  const [onClose, setOnClose] = useState(true);
  const btnRef = React.useRef();

  const handleFavouratesClick = (storeId) => {
    history.push(`/store-favourates/${storeId}`);
  };
  useEffect(() => {
    const getData = async () => {
      const storeResponse = await getStoreDataAll(storeLink);
      setStoreData(storeResponse.data.data.storeinfo);
      setStoreProducts(storeResponse.data.data.products);
      setStoreCategories(storeResponse.data.data.categories);
      //update store views analytics
      const analyticResponse = await updateStoreViews(
        storeResponse.data.data.storeinfo.id
      );
    };
    getData();
  }, []);
  useEffect(() => {
    const getSelectedProducts = async () => {
      const productsResponse = await getStoreProducts(
        storeData.id,
        catSelected
      );
      productsResponse && setStoreProducts(productsResponse.data.data);
    };
    storeData.id && getSelectedProducts();
  }, [catSelected]);

  return (
    <div className={styles.container}>
      <Button ref={btnRef} colorScheme="teal" onClick={() => setIsOpen(true)}>
        Open
      </Button>
      {/* drawer */}
      <Drawer
        isOpen={isOpen}
        placement="left"
        onClose={() => setIsOpen(false)}
        finalFocusRef={btnRef}
      >
        <DrawerOverlay>
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader>Create your account</DrawerHeader>

            <DrawerBody>
              <Input placeholder="Type here..." />
            </DrawerBody>

            <DrawerFooter>
              <Button variant="outline" mr={3} onClick={() => setIsOpen(false)}>
                Cancel
              </Button>
              <Button color="blue">Save</Button>
            </DrawerFooter>
          </DrawerContent>
        </DrawerOverlay>
      </Drawer>

      {storeData && (
        <div className={styles.store_card}>
          <h1 className={styles.store_name}>{storeData.account_store}</h1>
          <h1 className={styles.store_location}>
            {storeData.account_store_address}
          </h1>
          <Button onClick={() => handleFavouratesClick(storeData.id)}>
            Favourates
          </Button>
        </div>
      )}
      <InputGroup
        w="90%"
        mb="3"
        size="lg"
        backgroundColor="white"
        borderRadius="30px"
      >
        <InputLeftElement pointerEvents="none" children={<SearchIcon />} />
        <Input
          type="text"
          placeholder="search in this store"
          borderRadius="30px"
          borderColor="white"
        />
      </InputGroup>

      <div className={styles.categories}>
        <div className={styles.margin_left}></div>
        <div
          className={
            catSelected == "all"
              ? styles.category_item_selected
              : styles.category_item
          }
          onClick={() => setCatSelected("all")}
        >
          All
        </div>
        {storeCategories &&
          storeCategories.map((cat) => (
            <div
              key={cat.id}
              className={
                catSelected == cat.id
                  ? styles.category_item_selected
                  : styles.category_item
              }
              onClick={() => setCatSelected(cat.id)}
            >
              {cat.cat_name}
            </div>
          ))}
      </div>
      {/* <div className={styles.products}> */}
      {/* product item starts here */}
      <SimpleGrid columns={2} spacing={2} w="95%">
        {storeProducts.map((product) => {
          return (
            <div
              className={styles.product_item}
              onClick={() => history.push(`/product_detail/${product.id}`)}
              key={product.id}
            >
              {product.images && (
                <img
                  src={`${productImagesRoot}/min/${
                    product.images.split(",")[0]
                  }`}
                  alt="img"
                  className={styles.product_image}
                />
              )}
              <div className={styles.product_details}>
                <h1 className={styles.product_name}>{product.product_name}</h1>
                <h1 className={styles.product_price}>
                  ₹{product.product_price}
                </h1>
              </div>
            </div>
          );
        })}
        {/* product item ends here */}
      </SimpleGrid>
      {/* </div> */}
    </div>
  );
};

export default withRouter(Store);
