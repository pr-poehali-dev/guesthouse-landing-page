import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

interface Room {
  id: number;
  name: string;
  description: string;
  capacity: string;
  amenities: string[];
  image: string;
}

interface PriceItem {
  period: string;
  price: string;
  note?: string;
}

interface Service {
  name: string;
  price: string;
  icon: string;
}

interface Review {
  id: number;
  author: string;
  rating: number;
  text: string;
  date: string;
}

export default function Index() {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    dates: '',
    guests: '',
    message: '',
  });

  const rooms: Room[] = [
    {
      id: 1,
      name: 'Семейный домик #1',
      description: 'Уютный деревянный домик со спальным местом под крышей (160×200) и раскладным диваном. Включает кухню и санузел. Цена за 2-х человек с завтраком, доп. место +1000₽. Без питомцев.',
      capacity: '2-4 человека',
      amenities: ['Wi-Fi', 'Телевизор', 'Кухня', 'Санузел', 'Кондиционер', 'Завтрак включен'],
      image: 'https://cdn.poehali.dev/files/дом 1.jpg',
    },
    {
      id: 2,
      name: 'Семейный домик #2',
      description: 'Уютный домик со спальным местом под крышей (160×200) и раскладным диваном. Есть кухня и санузел. Цена за 2-х человек с завтраком, доп. место +1000₽. Без питомцев.',
      capacity: '2-4 человека',
      amenities: ['Wi-Fi', 'Телевизор', 'Кухня', 'Санузел', 'Кондиционер', 'Завтрак включен'],
      image: 'https://cdn.poehali.dev/files/Дом 2.jpg',
    },
    {
      id: 3,
      name: 'Домик на двоих #3',
      description: 'Уютный домик с двуспальной кроватью (160×200). Полностью оборудованная кухня и санузел. Цена за 2-х человек с завтраком. Питомцы разрешены по согласованию.',
      capacity: '2 человека',
      amenities: ['Wi-Fi', 'Телевизор', 'Кухня', 'Санузел', 'Кондиционер', 'Завтрак включен', 'Можно с питомцами'],
      image: 'https://cdn.poehali.dev/files/Домик на двоих.jpg',
    },
  ];

  const prices: PriceItem[] = [
    { period: 'Семейный домик #1', price: '7500 руб/сутки', note: 'за 2-х человек с завтраком' },
    { period: 'Семейный домик #2', price: '7500 руб/сутки', note: 'за 2-х человек с завтраком' },
    { period: 'Домик на двоих #3', price: '5600 руб/сутки', note: 'за 2-х человек с завтраком' },
    { period: 'Дополнительное место', price: '1000 руб', note: 'без завтрака' },
  ];

  const services: Service[] = [
    { name: 'Трансфер из аэропорта', price: '1500 руб', icon: 'Car' },
    { name: 'Баня/сауна', price: '2000 руб/2 часа', icon: 'Flame' },
    { name: 'Мангал и беседка', price: '500 руб/день', icon: 'Flame' },
    { name: 'Детская площадка', price: 'Бесплатно', icon: 'Baby' },
    { name: 'Парковка', price: 'Бесплатно', icon: 'ParkingCircle' },
    { name: 'Организация экскурсий', price: 'От 1000 руб', icon: 'MapPin' },
  ];

  const reviews: Review[] = [
    {
      id: 1,
      author: 'Анна М.',
      rating: 5,
      text: 'Прекрасное место для семейного отдыха! Чистые номера, уютная атмосфера. Дети были в восторге от детской площадки. Хозяева очень гостеприимные, помогли организовать экскурсии. Обязательно вернемся!',
      date: 'Ноябрь 2024'
    },
    {
      id: 2,
      author: 'Дмитрий К.',
      rating: 5,
      text: 'Отличный гостевой дом! Тихое спокойное место, красивая природа вокруг. Баня превосходная, мангальная зона удобная. Цены адекватные, сервис на высоте. Рекомендую!',
      date: 'Октябрь 2024'
    },
    {
      id: 3,
      author: 'Елена П.',
      rating: 5,
      text: 'Останавливались на неделю всей семьей. Все понравилось! Комфортные номера, есть все необходимое. Особенно порадовала кухня - можно готовить самим. Хозяева очень внимательные и отзывчивые.',
      date: 'Сентябрь 2024'
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.dates) {
      toast({
        title: 'Заполните обязательные поля',
        description: 'Пожалуйста, укажите имя, телефон и даты заезда',
        variant: 'destructive',
      });
      return;
    }

    try {
      const response = await fetch('https://functions.poehali.dev/0eba2145-234c-4574-b9d7-d0d19ee82cf9', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: 'Заявка отправлена!',
          description: 'Мы свяжемся с вами в ближайшее время',
        });
        setFormData({ name: '', phone: '', dates: '', guests: '', message: '' });
      } else {
        toast({
          title: 'Ошибка',
          description: data.error || 'Не удалось отправить заявку',
          variant: 'destructive',
        });
      }
    } catch (error) {
      toast({
        title: 'Ошибка сети',
        description: 'Проверьте подключение к интернету',
        variant: 'destructive',
      });
    }
  };

  return (
    <div className="min-h-screen">
      <section 
        className="relative h-screen flex items-center justify-center bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://cdn.poehali.dev/files/Дома.jpg')`,
        }}
      >
        <div className="text-center text-white z-10 px-4 animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-bold mb-4">Гостевой дом "Семейный"</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-2xl mx-auto">
            Уютный отдых для всей семьи в окружении природы
          </p>
          <Button 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6"
            onClick={() => document.getElementById('booking')?.scrollIntoView({ behavior: 'smooth' })}
          >
            Забронировать номер
          </Button>
        </div>
      </section>

      <section id="about" className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">О нашем гостевом доме</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="animate-scale-in hover:shadow-lg transition-shadow">
              <CardHeader>
                <Icon name="Home" size={48} className="text-primary mb-4" />
                <CardTitle>Уютная атмосфера</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Домашний комфорт и теплый прием ждут каждого гостя
                </p>
              </CardContent>
            </Card>
            <Card className="animate-scale-in hover:shadow-lg transition-shadow" style={{ animationDelay: '0.1s' }}>
              <CardHeader>
                <Icon name="Trees" size={48} className="text-secondary mb-4" />
                <CardTitle>Природа вокруг</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Живописное расположение в окружении зелени и свежего воздуха
                </p>
              </CardContent>
            </Card>
            <Card className="animate-scale-in hover:shadow-lg transition-shadow" style={{ animationDelay: '0.2s' }}>
              <CardHeader>
                <Icon name="Users" size={48} className="text-primary mb-4" />
                <CardTitle>Для всей семьи</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  Идеальное место для семейного отдыха с детьми
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      <section id="rooms" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Наши номера</h2>
          <div className="grid md:grid-cols-3 gap-8">
            {rooms.map((room) => (
              <Card key={room.id} className="overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                <img 
                  src={room.image} 
                  alt={room.name} 
                  className="w-full h-64 object-cover"
                />
                <CardHeader>
                  <CardTitle className="text-2xl">{room.name}</CardTitle>
                  <CardDescription className="text-base">{room.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center gap-2 mb-4 text-muted-foreground">
                    <Icon name="Users" size={20} />
                    <span>{room.capacity}</span>
                  </div>
                  <div className="space-y-2">
                    {room.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Icon name="Check" size={16} className="text-secondary" />
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="prices" className="py-20 px-4 bg-background">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Прайс-лист</h2>
          <Card>
            <CardContent className="p-0">
              <div className="divide-y divide-border">
                {prices.map((item, index) => (
                  <div 
                    key={index} 
                    className="p-6 hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex justify-between items-start gap-4 flex-wrap">
                      <div className="flex-1 min-w-[200px]">
                        <h3 className="font-semibold text-lg mb-1">{item.period}</h3>
                        {item.note && (
                          <p className="text-sm text-muted-foreground">{item.note}</p>
                        )}
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold text-primary">{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
          <p className="text-center text-muted-foreground mt-6">
            Скидки при проживании от 7 дней. Действует система скидок для постоянных гостей.
          </p>
        </div>
      </section>

      <section id="services" className="py-20 px-4 bg-muted/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-foreground">Дополнительные услуги</h2>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <Card 
                key={index} 
                className="hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <Icon name={service.icon} size={32} className="text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <CardDescription className="text-base font-semibold text-primary">
                        {service.price}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section id="reviews" className="py-20 px-4 bg-background">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-foreground">Отзывы наших гостей</h2>
          <p className="text-center text-muted-foreground mb-12">Что говорят о нас те, кто уже отдыхал у нас</p>
          <div className="grid md:grid-cols-3 gap-6">
            {reviews.map((review) => (
              <Card key={review.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <CardTitle className="text-lg">{review.author}</CardTitle>
                    <div className="flex gap-1">
                      {[...Array(review.rating)].map((_, i) => (
                        <Icon key={i} name="Star" size={16} className="text-yellow-500 fill-yellow-500" />
                      ))}
                    </div>
                  </div>
                  <CardDescription>{review.date}</CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{review.text}</p>
                </CardContent>
              </Card>
            ))}
          </div>
          <div className="text-center mt-8">
            <p className="text-muted-foreground mb-4">Средний рейтинг: 5.0 из 5</p>
            <a 
              href="https://2gis.ru/ulanude/firm/70000001036997690" 
              target="_blank" 
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Смотреть все отзывы на 2ГИС
              <Icon name="ExternalLink" size={16} />
            </a>
          </div>
        </div>
      </section>

      <section id="booking" className="py-20 px-4 bg-muted/30">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-4 text-foreground">Забронировать номер</h2>
          <p className="text-center text-muted-foreground mb-12">
            Оставьте заявку, и мы свяжемся с вами в ближайшее время
          </p>
          <Card>
            <CardContent className="pt-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Ваше имя *</Label>
                  <Input
                    id="name"
                    placeholder="Иван Иванов"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Телефон *</Label>
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+7 (999) 123-45-67"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dates">Даты заезда и выезда *</Label>
                  <Input
                    id="dates"
                    placeholder="01.06.2024 - 07.06.2024"
                    value={formData.dates}
                    onChange={(e) => setFormData({ ...formData, dates: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="guests">Количество гостей</Label>
                  <Input
                    id="guests"
                    type="number"
                    placeholder="2"
                    value={formData.guests}
                    onChange={(e) => setFormData({ ...formData, guests: e.target.value })}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Дополнительные пожелания</Label>
                  <Textarea
                    id="message"
                    placeholder="Напишите ваши пожелания или вопросы"
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={4}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full">
                  Отправить заявку
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      <footer className="bg-primary text-primary-foreground py-12 px-4">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <h3 className="font-bold text-xl mb-4">Гостевой дом "Семейный"</h3>
            <p className="text-primary-foreground/80">
              Ваш уютный дом вдали от дома
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Контакты</h4>
            <div className="space-y-2 text-primary-foreground/80">
              <p className="flex items-center gap-2">
                <Icon name="Phone" size={18} />
                +7 (999) 123-45-67
              </p>
              <p className="flex items-center gap-2">
                <Icon name="Mail" size={18} />
                info@semeiniy.ru
              </p>
            </div>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Мы в соцсетях</h4>
            <div className="flex gap-4">
              <a href="https://vk.com/guesthouse_semeiniy" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
                <Icon name="MessageCircle" size={24} />
              </a>
            </div>
          </div>
        </div>
        <div className="max-w-6xl mx-auto mt-8 pt-8 border-t border-primary-foreground/20 text-center text-primary-foreground/60">
          <p>© 2024 Гостевой дом "Семейный". Все права защищены.</p>
        </div>
      </footer>
    </div>
  );
}