package paquete;

import java.io.*;
import java.net.*;
import java.util.*;

public class Cliente {

	private String HOST = "";
	private static final int PORT = 1090;
	Scanner scanner = new Scanner(System.in);

	public Cliente() {
	}

	public static void main(String[] args) {
		Cliente c = new Cliente();
		c.iniciarCliente();
	}

	public void iniciarCliente() {
		try {
			System.out.println("\"192.168.56.1\": ");
			HOST = scanner.nextLine();
			Socket socket = new Socket(HOST, 1090);

			DataOutputStream flujoSalida = new DataOutputStream(socket.getOutputStream());
			DataInputStream flujoEntrada = new DataInputStream(socket.getInputStream());

			System.out.print("PIN de juego: ");
			int PIN = scanner.nextInt();
			scanner.nextLine();

			flujoSalida.writeInt(PIN);

			String pinCorrecto = flujoEntrada.readUTF();

			while (pinCorrecto.equals("NOPIN")) {
				System.out.println("[ + ] Error: PIN Incorrecto");
				System.out.print("PIN de juego ");
				PIN = scanner.nextInt();
				scanner.nextLine();
				flujoSalida.writeInt(PIN);
				pinCorrecto = flujoEntrada.readUTF();
			}

			System.out.print("Ingrese su nombre de usuario: ");
			String nombreUsuario = scanner.nextLine();

			flujoSalida.writeUTF(nombreUsuario);

			String acceso = flujoEntrada.readUTF();

			while (acceso.equalsIgnoreCase("no")) {
				System.out.println("[ + ] Error: Nombre de usuario ya existe");
				System.out.print("Ingrese un nombre de usuario diferente: ");
				nombreUsuario = scanner.nextLine();
				flujoSalida.writeUTF(nombreUsuario);
				acceso = flujoEntrada.readUTF();
			}
			int k = 0;
			int cantPreguntas = flujoEntrada.readInt();
			System.out.println("Bienvenido, " + nombreUsuario + "!");
			while (k < cantPreguntas) {
				String pregunta = flujoEntrada.readUTF();
				System.out.println("Q: " + pregunta);

				for (int i = 0; i < 4; i++) {
					String opciones = flujoEntrada.readUTF();
					System.out.println((i + 1) + ".- " + opciones);
				}

				System.out.print("R = ");
				
				final int TIEMPO_MAXIMO_ESPERA = 6000;
				long tiempoInicio = System.currentTimeMillis();
		        String respuesta = leerRespuestaConTemporizador(TIEMPO_MAXIMO_ESPERA);
		        long tiempoFinal = System.currentTimeMillis();
		        long tiempoTotal = tiempoFinal - tiempoInicio;

		        System.out.println("Tiempo total de respuesta: " + tiempoTotal + "ms");
				
				flujoSalida.writeUTF(respuesta);

				String acerto = flujoEntrada.readUTF();
				System.out.println(acerto);
				k++;
			}
			String puntajefinal = flujoEntrada.readUTF();
			System.out.println("fs " + puntajefinal);

			flujoEntrada.close();
			flujoSalida.close();
			socket.close();
		} catch (Exception e) {
			System.out.println("[ - ] Error: No se puede conectar con el host. " + e.getMessage());

		}
	}
	
	private static String leerRespuestaConTemporizador(int tiempoMaximo) {
        Temporizador temporizador = new Temporizador(tiempoMaximo);
        temporizador.start();

        String respuesta = "";
        try {
            respuesta = new java.util.Scanner(System.in).nextLine();
        } catch (Exception ex) {
            // ignorar excepción
        }

        temporizador.cancelar();
        return respuesta;
    }
	
	private static class Temporizador extends Thread {
		private int tiempoMaximo;
		private boolean cancelado;

		public Temporizador(int tiempoMaximo) {
			this.tiempoMaximo = tiempoMaximo;
			this.cancelado = false;
		}

		public void cancelar() {
			this.cancelado = true;
		}

		public void run() {
			try {
				Thread.sleep(tiempoMaximo);
				if (!cancelado) {
					System.out.println("Tiempo de respuesta agotado. Enviando respuesta vacía...");
					
				}
			} catch (InterruptedException ex) {
				// ignorar excepción
			}
		}
	}
}
