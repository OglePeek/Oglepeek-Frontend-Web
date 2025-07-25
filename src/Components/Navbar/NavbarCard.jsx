import React, { useContext } from "react";
import Login from "../../Pages/Login/Login";
import Signup from "../../Pages/Signup/Signup";
import { Link, useNavigate } from "react-router-dom";
import NavbarCardCategories from "./NavbarCardCategories";
import { AuthContext } from "../../ContextApi/AuthContext";
import { FiPhoneCall } from "react-icons/fi";
import { CiHeart } from "react-icons/ci";
import { CgShoppingCart } from "react-icons/cg";
import Oglepeek from './Oglepeek.png';
import { useSelector } from "react-redux";
import { BsHeartFill } from "react-icons/bs";
import { clearCart } from "../../redux/CartPage/action";
import { clearWishlist } from "../../redux/wishlist/wishlist.actions";
import { useDispatch } from "react-redux";
import {
  Box,
  Text,
  Flex,
  Image,
  Input,
  Button,
  HStack,
  useColorModeValue,
  useColorMode,
  Switch,
  useDisclosure,
  Avatar,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerHeader,
  DrawerBody,
  DrawerCloseButton,
  List,
  ListItem,
  ListIcon,
  useToast
} from "@chakra-ui/react";

import { MdPayment, MdInventory, MdHistory } from "react-icons/md";
import { FaBoxOpen } from "react-icons/fa";

export const NavbarCardTopmost = () => {
  const toast = useToast();
  const dispatch = useDispatch();
  const bgColor = useColorModeValue("gray.100", "gray.600");
  const buttonBg = useColorModeValue("whiteAlpha.900", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const borderColor = useColorModeValue("blackAlpha.400", "whiteAlpha.300");
  const { colorMode, toggleColorMode } = useColorMode();

  const { cart } = useSelector((state) => state.CartReducer);
  const { wishlist } = useSelector((state) => state.wishlistReducer);
  const { isAuth, setisAuth, Authdata, setAuthData } = useContext(AuthContext);

  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const handleLogout = async () => {
    let HOST = process.env.REACT_APP_HOST;

    try {
      await fetch(`${HOST}/api/auth/logout`, {
        method: "POST",
        credentials: "include", // ✅ ensure cookie is cleared
      });

      // Clear redux states
      dispatch(clearCart());
      dispatch(clearWishlist());

      localStorage.removeItem("wishlist"); // Clear wishlist from local storage

      // Clear cookie
      // document.cookie = "authToken=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"; // Clear auth token cookie

      // Clear auth context
      setisAuth(false);
      setAuthData(null);

      onClose(); // close the drawer
      navigate("/"); // redirect to homepage
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <Box cursor="pointer" bg={bgColor} color={textColor}>
      <HStack m="auto">
        <Box w="12%">
          <Link to="/">
            <Image src={Oglepeek} alt="logo" w="40%" h="auto" ml="10%" />
          </Link>
        </Box>

        <HStack w="85%" m="auto">
          <Box w="20%">
            <HStack fontSize="15px" fontWeight="bold" color={textColor}>
              <FiPhoneCall />
              <Text>+(977)-986-8956905</Text>
            </HStack>
          </Box>

          <Box w="40%">
            <Input
              placeholder="What are you looking for"
              border={`1px solid ${borderColor}`}
              w="76%"
              fontSize="17px"
              h="35px"
              _focus={{ borderColor: "teal.400" }}
              bg={useColorModeValue("white", "gray.700")}
              color={textColor}
            />
            <Button colorScheme="teal" height="30px" ml="10px" mb="5px">Search</Button>
          </Box>

          {/* Theme Toggle */}
          <Box display="flex" alignItems="center" w="auto" ml={2}>
            <Text fontSize="sm" mr={2}>
              {colorMode === "light" ? "☀️" : "🌙"}
            </Text>
            <Switch
              isChecked={colorMode === "dark"}
              onChange={toggleColorMode}
              colorScheme="teal"
            />
          </Box>

          <HStack w="35%">
            {isAuth && (
              <Button
                size="lg"
                bg={buttonBg}
                fontSize="14px"
                fontWeight="400"
                onClick={() => navigate("/orderhistory")}
              >
                Your Orders
              </Button>
            )}

            {!isAuth && (
              <Box display="flex" cursor="pointer">
                <Login />
                <Signup />
              </Box>
            )}

            <Box position="relative">
              <Button
                leftIcon={wishlist.length > 0 ? <BsHeartFill color="red" /> : <CiHeart />}
                size="lg"
                bg={buttonBg}
                fontSize="14px"
                fontWeight="400"
                onClick={() => navigate("/wishlist")}
              >
                Wishlist
              </Button>
              {wishlist.length > 0 && (
                <Box
                  position="absolute"
                  top="0"
                  right="5"
                  bg="red.500"
                  color="white"
                  fontSize="12px"
                  borderRadius="full"
                  px="2"
                  h="18px"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  {wishlist.length}
                </Box>
              )}
            </Box>

            <Link to="/cart">
              <Box position="relative">
                <Button
                  leftIcon={<CgShoppingCart />}
                  size="lg"
                  bg={buttonBg}
                  fontSize="14px"
                  fontWeight="400"
                >
                  Cart
                </Button>
                {cart.length > 0 && (
                  <Box
                    position="absolute"
                    top="0"
                    right="5"
                    bg="red.500"
                    color="white"
                    fontSize="11px"
                    borderRadius="full"
                    px="1.5"
                    minW="18px"
                    h="18px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    zIndex="1"
                  >
                    {cart.length}
                  </Box>
                )}
              </Box>
            </Link>

            {/* Profile Drawer Trigger */}
            {/* {isAuth && ( */}
            <Box>
              <Avatar
                name={Authdata?.firstName || "Guest"}
                size="sm"
                cursor="pointer"
                onClick={onOpen}
                bg="teal.500"
                color="white"
                ml={3}
              />
            </Box>
            {/* )} */}
          </HStack>
        </HStack>
      </HStack>

      {/* Profile Drawer */}
      <Drawer isOpen={isOpen} placement="right" onClose={onClose}>
        <DrawerOverlay />
        <DrawerContent bg={bgColor} color={textColor}>
          <DrawerCloseButton />
          <DrawerHeader borderBottomWidth="1px">
            Hello, {Authdata?.firstName || "Guest"}
            <Text fontSize="sm" color="gray.400">{Authdata?.email}</Text>
          </DrawerHeader>
          <DrawerBody>
            <List spacing={4} mt={4}>
              <ListItem
                _hover={{ fontWeight: "bold", color: "teal.400", cursor: "pointer" }}
                onClick={() => {
                  if (!isAuth) {
                    toast({
                      title: "Login Required",
                      description: "Please log in to view your orders.",
                      status: "warning",
                      duration: 3000,
                      isClosable: true,
                      position: "top-center",
                    });
                    return;
                  }
                  navigate("/orderhistory");
                  onClose();
                }}
              >
                <ListIcon as={MdHistory} color="teal.400" />
                Your Orders
              </ListItem>
              <ListItem
                _hover={{ fontWeight: "bold", color: "teal.400", cursor: "pointer" }}
                onClick={() => {
                  if (!isAuth) {
                    toast({
                      title: "Login Required",
                      description: "Please log in to track your orders.",
                      status: "warning",
                      duration: 3000,
                      isClosable: true,
                      position: "top-center",
                    });
                    return;
                  }
                  navigate("/orderhistory");
                  onClose();
                }}
              >
                <ListIcon as={FaBoxOpen} color="teal.400" />
                Track Order
              </ListItem>
              <ListItem
                _hover={{ fontWeight: "bold", color: "teal.400", cursor: "pointer" }}
                onClick={() => {
                  if (!isAuth) {
                    toast({
                      title: "Login Required",
                      description: "Please log in to view your payments.",
                      status: "warning",
                      duration: 3000,
                      isClosable: true,
                      position: "top-center",
                    });
                    return;
                  }
                  navigate("/payments");
                  onClose();
                }}
              >
                <ListIcon as={MdPayment} color="teal.400" />
                Payment History
              </ListItem>
              <ListItem
                _hover={{ fontWeight: "bold", color: "teal.400", cursor: "pointer" }}
                onClick={() => {
                  if (!isAuth) {
                    toast({
                      title: "Login Required",
                      description: "Please log in to view your purchased items.",
                      status: "warning",
                      duration: 3000,
                      isClosable: true,
                      position: "top-center",
                    });
                    return;
                  }
                  navigate("/purchased");
                  onClose();
                }}
              >
                <ListIcon as={MdInventory} color="teal.400" />
                Purchased Items
              </ListItem>
              <ListItem
                mt={6}
                fontWeight="bold"
                color="red.500"
                cursor="pointer"
                onClick={handleLogout}
              >
                Sign Out
              </ListItem>
            </List>
          </DrawerBody>
        </DrawerContent>
      </Drawer>
    </Box>
  );
};


export const NavbarCardCategoryList = () => {
  const bgColor = useColorModeValue("#fbf9f7", "gray.700");
  return (
    <Box cursor="pointer" bg={bgColor} p={2.5}>
      <Flex gap={4} pl={5} pt={2} justifyContent="space-between">
        <NavbarCardCategories />
      </Flex>
    </Box>
  );
};
