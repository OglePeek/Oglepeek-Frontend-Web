import React, { useContext, useState } from "react";
import { AuthContext } from "../../ContextApi/AuthContext";
import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons";
import { useNavigate } from "react-router-dom";
import formImage from "../Home/images/topCorouselImage1.jpeg";
import {
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
  Button,
  Image,
  Box,
  Heading,
  Input,
  Center,
  InputGroup,
  InputRightElement,
  Text,
  useColorModeValue
} from "@chakra-ui/react";

import { useDispatch } from "react-redux";
import { loadCartFromBackend } from "../../redux/CartPage/action";
import { loadWishlistFromLocalStorage } from "../../redux/wishlist/wishlist.actions";

const Login = () => {
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const { setisAuth, setAuthData } = useContext(AuthContext);
  const { isOpen, onOpen, onClose } = useDisclosure();
  const navigate = useNavigate();

  const iconColor = useColorModeValue("gray.700", "gray.600");
  const closeBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("#333368", "gray.100");

  const dispatch = useDispatch();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setLoginData((prev) => ({ ...prev, [name]: value }));
    setErrorMsg("");
  };

  const handleLogin = async () => {
    if (!loginData.email || !loginData.password) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      let HOST = process.env.REACT_APP_HOST || "http://localhost:8000";
      const res = await fetch(`${HOST}/api/auth/login/email/test`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify(loginData)
      });

      const data = await res.json();

      if (res.ok) {
        setisAuth(true);
        setAuthData({ firstName: data.firstName, peekCoins: data.peekCoins });
        dispatch(loadCartFromBackend());
        dispatch(loadWishlistFromLocalStorage());

        onClose();
        navigate("/"); // Redirect to home page after successful login
      } else {
        setErrorMsg(data.message || "Invalid credentials");
      }
    } catch (error) {
      setErrorMsg("Server error. Please try again.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div>
      <Center onClick={onOpen} fontWeight="400" fontSize="15px" w="80px">
        Sign In
      </Center>

      <Modal isOpen={isOpen} onClose={onClose} isCentered size="sm">
        <ModalOverlay />
        <ModalContent rounded="3xl">
          <ModalCloseButton bg={closeBg} m="10px 10px 0px 0px" />
          <ModalBody p="0px">
            <Image
              src={formImage}
              alt="Login Image"
              borderRadius="10px 10px 0px 0px"
              objectFit="cover"
              objectPosition="center top 10%" // Crop from bottom (i.e., keep top visible)
              width="100%"
              height={{ base: "auto", sm: "300px", md: "300px", lg: "300px" }} // Responsive heights
              maxH="300px"
            />

            <Box m="34px 45px 50px 45px">
              <Heading fontSize="28px" mb="24px" color={textColor}>
                Sign In
              </Heading>

              <Input
                name="email"
                type="email"
                placeholder="Email"
                h="50px"
                fontSize="16px"
                onChange={handleChange}
                value={loginData.email}
                rounded="2xl"
                mb="15px"
              />

              <InputGroup>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  h="50px"
                  fontSize="16px"
                  onChange={handleChange}
                  value={loginData.password}
                  rounded="2xl"
                />
                <InputRightElement width="4.5rem">
                  <Button h="1.75rem" size="sm" onClick={() => setShowPassword(!showPassword)} bg="white">
                    {showPassword ? <ViewOffIcon color={iconColor} /> : <ViewIcon color={iconColor} />}
                  </Button>
                </InputRightElement>
              </InputGroup>

              {errorMsg && (
                <Text mt="2" color="red.500" fontSize="sm" textAlign="center">
                  {errorMsg}
                </Text>
              )}

              <Button
                isLoading={loading}
                onClick={handleLogin}
                bgColor="#11daac"
                color="white"
                width="100%"
                mt="25px"
                h="50px"
                fontSize="18px"
                borderRadius="35px"
                _hover={{ bgColor: "#11daac" }}
              >
                Sign In
              </Button>

              {/* <HStack spacing="0px" mt="20px" gap="2" justify="center">
                <Box fontSize="14px">New member?</Box>
                <Button variant="link" fontSize="15px" color="blue.500">
                  Create an Account
                </Button>
              </HStack> */}
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default Login;
