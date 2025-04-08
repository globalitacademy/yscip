
import { Globe } from 'lucide-react';
import { EducationalModule } from '../types';

export const networkingModules: EducationalModule[] = [
  { 
    id: 4, 
    title: "Համակարգչային ցանցեր", 
    icon: Globe, 
    status: 'in-progress', 
    progress: 40,
    topics: [
      "Համակարգչային ցանցերի ներածություն",
      "Ցանցերի տեսակներ (LAN, WAN, MAN)",
      "Տոպոլոգիաներ (աստղային, օղակաձև, ծառ)",
      "OSI մոդելի 7 շերտերը",
      "TCP/IP մոդել",
      "Ֆիզիկական շերտ (Physical Layer)",
      "Կապի միջավայրեր (մալուխներ, անլար)",
      "Տվյալների կապի շերտ (Data Link Layer)",
      "MAC հասցեավորում",
      "Ethernet ստանդարտներ",
      "Ցանցային շերտ (Network Layer)",
      "IP հասցեավորում (IPv4, IPv6)",
      "Ենթացանցերի դիմակներ",
      "Մարշրուտիզացիա",
      "Ստատիկ և դինամիկ մարշրուտիզացիա",
      "Տրանսպորտային շերտ (Transport Layer)",
      "TCP և UDP պրոտոկոլներ",
      "Պորտեր և սոկետներ",
      "Սեսիայի շերտ (Session Layer)",
      "Ներկայացման շերտ (Presentation Layer)",
      "Հավելվածի շերտ (Application Layer)",
      "HTTP և HTTPS պրոտոկոլներ",
      "DNS համակարգ",
      "DHCP ծառայություն",
      "NAT տեխնոլոգիա",
      "VPN տեխնոլոգիաներ",
      "VLAN-ներ",
      "Ցանցային սարքեր (երթուղիչ, կոմուտատոր, հաբ)",
      "Ցանցային անվտանգություն",
      "Ֆայրվոլներ և նրանց կարգավորում",
      "Վիրտուալ ցանցեր",
      "Ցանցերի ախտորոշում և կարգաբերում"
    ]
  }
];
