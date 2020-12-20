import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styles from "./css/categories.module.css";
import { getCategoriesAPI } from "../api/sellerCategoryAPI";
import axios from "axios";
import Loader from "react-loader-spinner";
import "react-loader-spinner/dist/loader/css/react-spinner-loader.css";
import LabelHeader from "../components/labelHeader";
import { Box } from "@chakra-ui/react";

const Categories = () => {
  const [isLogin, setIsLogin] = useState([]);
  const [categoriesArray, setCategoriesArray] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const getCategoriesData = async () => {
      setIsLoading(true);
      const Data = await getCategoriesAPI();
      setIsLogin(Data.data.login);
      setCategoriesArray(Data.data.data);
      setIsLoading(false);
      console.log(Data);
    };
    getCategoriesData();
  }, []);
  return (
    <>
      <div className={styles.container}>
        <LabelHeader label={"Categories"} />
        {isLoading ? (
          <div className={styles.loaderwraper}>
            <Loader
              type="Oval"
              color="#00b140"
              height={50}
              width={50}
              visible={isLoading}
            />
          </div>
        ) : (
          <div></div>
        )}
        {isLogin &&
          categoriesArray.map((item, index) => (
            <Link
              to={`/products/${item.cat_name}/${item.id}`}
              key={index}
              className={styles.link}
            >
              <Box
                w="90%"
                h="auto"
                mt="10px"
                borderWidth="1px"
                borderRadius="lg"
              >
                <h1 className={styles.heading_bold}>{item.cat_name}</h1>
                <h1 className={styles.heading_normal}>
                  {item.product_count < 1 ? "No" : item.product_count} Products
                </h1>
              </Box>
            </Link>
          ))}

        <Link to="/add_category" className={styles.btn}>
          ADD CATEGORIES
        </Link>

        <div className={styles.blank}></div>
      </div>
    </>
  );
};

export default Categories;
