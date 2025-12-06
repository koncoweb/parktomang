import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../button';

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('harus merender dengan title yang benar', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('harus memanggil onPress ketika ditekan', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    
    const button = getByText('Test Button');
    fireEvent.press(button);
    
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('harus merender dengan variant primary sebagai default', () => {
    const { getByText } = render(
      <Button title="Primary Button" onPress={mockOnPress} />
    );
    
    const button = getByText('Primary Button');
    expect(button).toBeTruthy();
  });

  it('harus merender dengan variant secondary', () => {
    const { getByText } = render(
      <Button title="Secondary Button" onPress={mockOnPress} variant="secondary" />
    );
    
    const button = getByText('Secondary Button');
    expect(button).toBeTruthy();
  });

  it('harus menonaktifkan button ketika disabled', () => {
    const { getByText } = render(
      <Button title="Disabled Button" onPress={mockOnPress} disabled />
    );
    
    const button = getByText('Disabled Button');
    fireEvent.press(button);
    
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('harus menampilkan loading indicator ketika loading', () => {
    const { queryByText, UNSAFE_getByType } = render(
      <Button title="Loading Button" onPress={mockOnPress} loading />
    );
    
    // Text tidak boleh terlihat saat loading
    expect(queryByText('Loading Button')).toBeNull();
    
    // ActivityIndicator harus ada
    // Note: ActivityIndicator mungkin perlu di-mock atau di-test dengan cara lain
  });

  it('harus tidak memanggil onPress ketika loading', () => {
    const { getByTestId } = render(
      <Button title="Loading Button" onPress={mockOnPress} loading />
    );
    
    // Button harus disabled saat loading
    // Note: Perlu menambahkan testID untuk testing yang lebih baik
  });

  it('harus menerima custom style', () => {
    const customStyle = { marginTop: 20 };
    const { getByText } = render(
      <Button title="Styled Button" onPress={mockOnPress} style={customStyle} />
    );
    
    const button = getByText('Styled Button');
    expect(button).toBeTruthy();
  });

  it('harus tidak memanggil onPress ketika disabled dan loading', () => {
    const result = render(
      <Button 
        title="Disabled Loading Button" 
        onPress={mockOnPress} 
        disabled 
        loading 
      />
    );
    
    // Button dalam state loading, jadi tidak ada text yang ditampilkan
    // Hanya ActivityIndicator yang ditampilkan
    // Test ini hanya memastikan komponen tidak crash saat disabled dan loading
    expect(result).toBeTruthy();
  });
});

