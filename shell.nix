{ pkgs ? import <nixpkgs> {} }:

with pkgs;

let libs = [
  alsaLib
  atk
  cairo
  cups
  dbus
  expat
  fontconfig.lib
  fontconfig.dev
  gdk_pixbuf
  glib
  glibc
  gnome3.gconf
  gtk2
  nspr
  nss
  #libxcb
  pango
  freetype
  stdenv.cc.cc.lib
  zlib
] ++ (with xorg; [
  libX11
  libxcb
  libXcomposite
  libXcursor
  libXdamage
  libXext
  libXi
  libXfixes
  libXrandr
  libXrender
  libXScrnSaver
  libXtst
]);
in stdenv.mkDerivation {
  name = "candela";

  buildInputs = [
    nodejs
  ] ++ libs;

  C_INCLUDE_PATH = "${fontconfig.dev}/include";
  LD_LIBRARY_PATH = stdenv.lib.makeLibraryPath libs;

  shellHook = ''
    echo "Candela nix dev environment"
  '';
}
