/**
 * Mock file untuk react-native/jest/setup.js
 * File ini digunakan untuk menggantikan file setup React Native yang berisi TypeScript syntax
 * dan ES modules yang tidak bisa di-parse oleh Babel dalam konteks Jest
 */

// Set global flags yang diperlukan oleh React Native testing
global.IS_REACT_ACT_ENVIRONMENT = true;
global.IS_REACT_NATIVE_TEST_ENVIRONMENT = true;

// Mock polyfills dan mocks yang diperlukan
// Implementasi lengkap sudah di-handle di jest.setup.js

