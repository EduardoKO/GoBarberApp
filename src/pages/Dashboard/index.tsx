import React, { useCallback, useEffect, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather'
import { useAuth } from '../../hooks/auth';

import { Container, Header, UserName, HeaderTitle, ProvidersListTitle, ProfileButton, UserAvatar, ProviderContainer, ProviderMetaText, ProviderInfo, ProviderName, ProviderMeta, ProviderAvatar, ProvidersList } from './styles';
import { useNavigation } from '@react-navigation/native';
import api from '../../services/api';
import { string } from 'yup';

export interface Provider {
  id:string;
  name:string;
  avatar_url:string;
}

const Dashboard: React.FC = () => {
  const [providers, setProviders] = useState<Provider[]>([]);

  const { signOut, user } = useAuth();
  const { navigate } = useNavigation();

  const navigateToProfile = useCallback(() => {
    // navigate('Profile')
    signOut();
  }, [navigate]);

  const navigateToCreateAppointment = useCallback((providerId: string) => {
    navigate('CreateAppointment', {providerId})
  }, [navigate])

  useEffect(() => {
    api.get('providers').then(response => {
      setProviders(response.data);
    })
  }, [])

  return (
    <Container>
      <Header>
        <HeaderTitle>
          Bem vindo, {"\n"}
          <UserName>{user.name}</UserName>
        </HeaderTitle>

        <ProfileButton onPress={navigateToProfile}>
          <UserAvatar source={{uri: user.avatar_url}}/>
        </ProfileButton>
      </Header>

      <ProvidersList
        keyExtractor={provider => provider.id}
        data={providers}
        ListHeaderComponent={
          <ProvidersListTitle>Cabeleireiros</ProvidersListTitle>
        }
        renderItem={({item : provider}) => (
          <ProviderContainer onPress={() => navigateToCreateAppointment(provider.id)}>
            <ProviderAvatar source={{uri: provider.avatar_url}} />

            <ProviderInfo>
              <ProviderName>{provider.name}</ProviderName>

              <ProviderMeta>
                <Icon name="calendar" size={14} color="#FF9000"/>
                <ProviderMetaText>Segunda à sexta</ProviderMetaText>
              </ProviderMeta>
              <ProviderMeta>
                <Icon name="clock" size={14} color="#FF9000"/>
                <ProviderMetaText>8h às 18h</ProviderMetaText>
              </ProviderMeta>
            </ProviderInfo>
          </ProviderContainer>
        )}
      />
    </Container>
  );
};

export default Dashboard;
