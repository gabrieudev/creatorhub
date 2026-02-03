import { Facebook, Instagram, Linkedin, Twitter } from "lucide-react";
import Image from "next/image";

export function Footer() {
  return (
    <footer className="py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-5 gap-8 mb-8">
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <Image src="/logo.png" alt="CreatorHub" width={32} height={32} />
              <span className="text-2xl font-bold">CreatorHub</span>
            </div>
            <p className="mb-6">
              A plataforma completa para criadores de conteúdo e suas equipes.
              Planeje, produza, monetize e colabore em um só lugar.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="hover:text-white transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="hover:text-white transition-colors">
                <Linkedin className="h-5 w-5" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4 ">Produto</h4>
            <ul className="space-y-2">
              <li>
                <a href="#">Funcionalidades</a>
              </li>
              <li>
                <a href="#">Preços</a>
              </li>
              <li>
                <a href="#">API</a>
              </li>
              <li>
                <a href="#">Status</a>
              </li>
              <li>
                <a href="#">Changelog</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Empresa</h4>
            <ul className="space-y-2">
              <li>
                <a href="#">Sobre</a>
              </li>
              <li>
                <a href="#">Blog</a>
              </li>
              <li>
                <a href="#">Carreiras</a>
              </li>
              <li>
                <a href="#">Contato</a>
              </li>
              <li>
                <a href="#">Parcerias</a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-lg mb-4">Recursos</h4>
            <ul className="space-y-2">
              <li>
                <a href="#">Documentação</a>
              </li>
              <li>
                <a href="#">Help Center</a>
              </li>
              <li>
                <a href="#">Comunidade</a>
              </li>
              <li>
                <a href="#">Tutoriais</a>
              </li>
              <li>
                <a href="#">Webinars</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="mb-4 md:mb-0">
              © {new Date().getFullYear()} CreatorHub. Todos os direitos
              reservados.
            </p>
            <div className="flex space-x-6 text-sm">
              <a href="#">Privacidade</a>
              <a href="#">Termos</a>
              <a href="#">Cookies</a>
              <a href="#">Configurações</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
