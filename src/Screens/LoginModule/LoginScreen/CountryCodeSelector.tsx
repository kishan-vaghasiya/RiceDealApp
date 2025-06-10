import React, { useState } from 'react';
import {
    View,
    Text,
    Modal,
    FlatList,
    TouchableOpacity,
    StyleSheet,
    TextInput,
} from 'react-native';

import countryData from './countryData.json'; // Your JSON file

const CountryCodeSelector = () => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedCountry, setSelectedCountry] = useState({ name: 'India', dial_code: '+91' });
    const [search, setSearch] = useState('');

    const filteredData = countryData.filter(country =>
        country.name.toLowerCase().includes(search.toLowerCase())
    );

    const handleSelect = (country) => {
        setSelectedCountry(country);
        setModalVisible(false);
    };
