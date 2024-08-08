import { Heading } from '@chakra-ui/react';
import React from 'react';

export default function ErrorPage(): JSX.Element {
  const containerStyles: React.CSSProperties = {
    position: 'relative', // Устанавливаем относительное позиционирование для контейнера
    height: 'calc(100vh - 114px)', // Высота контейнера с учетом высоты навбара (114px)
    display: 'flex',
    flexDirection: 'column', // Позиционирование содержимого по вертикали
    alignItems: 'center', // Центрирование содержимого по горизонтали
    justifyContent: 'center', // Центрирование содержимого по вертикали
    overflow: 'hidden', // Обрезаем содержимое, если оно выходит за пределы
  };

  const textStyles: React.CSSProperties = {
    position: 'absolute', // Абсолютное позиционирование текста
    top: '50%', // Позиционирование текста по вертикали в центре
    left: '50%', // Позиционирование текста по горизонтали в центре
    transform: 'translate(-50%, -50%)', // Центрирование текста по обеим осям
    fontFamily: 'Rubik Marker Hatch', // Используйте шрифт Google
    fontWeight: '550',
    lineHeight: '48px',
    textAlign: 'center', // Выравнивание текста по центру
    color: '#ffc100',
    maxWidth: '90%', // Установите максимальную ширину текста
    zIndex: 10, // Убедитесь, что текст поверх картинки
  };

  const imgStyles: React.CSSProperties = {
    width: '60%', // Изображение занимает 60% ширины контейнера
    height: 'auto', // Сохраняем пропорции изображения
  };

  return (
    <div style={containerStyles}>
      <img alt="Anton" src="/Anton.jpg" style={imgStyles} />
      <Heading as="h1" style={textStyles}>
        Простите Извините, на этой странице можем предложить только такой мем:
      </Heading>
    </div>
  );
}
