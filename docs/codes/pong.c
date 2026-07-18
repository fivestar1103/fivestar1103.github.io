#include <conio.h>
#include <stdio.h>
#include <stdlib.h>
#include <windows.h>

#define SCREEN_WIDTH 80
#define SCREEN_HEIGHT 50
#define PADDLE_WIDTH 2
#define PADDLE_HEIGHT 4
#define PADDLE_OFFSET 3
#define BALL_SIZE 1
#define BOARD_WIDTH 80
#define BOARD_HEIGHT 23
#define PADDLE_SPEED 1
#define BALL_SPEED 1
#define FRAME_DELAY 1000 / 60
#define WIN_SCORE 5

typedef struct {
    int paddle1Y, paddle2Y;
    int ballX, ballY;
    int ballVelX, ballVelY;
    int score1, score2;
} GameState;

// Function prototypes
void clearScreen();
void gotoxy(int x, int y);
void setColor(int ForgC);
void drawBorder();
void showWelcomeScreen();
void drawBoard(GameState *game);
void drawScore(GameState *game);
void processInput(char key, GameState *game);
void updateGame(GameState *game);
void resetBall(GameState *game);
void pauseAndDisplayScore(GameState *game, int player);

int main() {
    // Initialize game state
    GameState game = {
        BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2, BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2,
        BOARD_WIDTH / 2, BOARD_HEIGHT / 2,
        BALL_SPEED, BALL_SPEED,
        0, 0
    };

    // Hide cursor
    HANDLE consoleHandle = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_CURSOR_INFO info;
    info.dwSize = 100;
    info.bVisible = FALSE;
    SetConsoleCursorInfo(consoleHandle, &info);

    showWelcomeScreen();

    // Start game loop
    while (1) {
        if (_kbhit()) {
            processInput(_getch(), &game);
        }
        updateGame(&game);
        drawBorder();
        drawBoard(&game);
        drawScore(&game);
        Sleep(FRAME_DELAY); // Sleep to slow down the frame rate
        
        // Display controls and game rules
        gotoxy(0, BOARD_HEIGHT+1);
        printf("Controls: 'W' and 'S' for left paddle, 'I' and 'K' for right paddle.\n\nFirst to score %d points wins.\n", WIN_SCORE);
    }

    return 0;
}

// Main utility functions
void clearScreen() {
    system("cls");
}

void gotoxy(int x, int y) {
    COORD coord;
    coord.X = x;
    coord.Y = y;
    SetConsoleCursorPosition(GetStdHandle(STD_OUTPUT_HANDLE), coord);
}

void setColor(int ForgC) {
    WORD wColor;
    HANDLE hStdOut = GetStdHandle(STD_OUTPUT_HANDLE);
    CONSOLE_SCREEN_BUFFER_INFO csbi;

    if(GetConsoleScreenBufferInfo(hStdOut, &csbi)) {
        wColor = (csbi.wAttributes & 0xF0) + (ForgC & 0x0F);
        SetConsoleTextAttribute(hStdOut, wColor);
    }
}

void drawBorder() {
    gotoxy(0, 0);
    for (int x = 0; x < BOARD_WIDTH; x++) {
        printf("=");
    }
    for (int y = 1; y < BOARD_HEIGHT - 1; y++) {
        gotoxy(0, y);
        printf("|");
        gotoxy(BOARD_WIDTH - 1, y);
        printf("|");
    }
    gotoxy(0, BOARD_HEIGHT - 1);
    for (int x = 0; x < BOARD_WIDTH; x++) {
        printf("=");
    }
}

void showWelcomeScreen() {
    clearScreen(); // Clear the console screen

    // Draw a border around the welcome message
    int border_width = 30;
    int border_height = 10;
    int start_x = BOARD_WIDTH / 2 - border_width / 2;
    int start_y = BOARD_HEIGHT / 2 - border_height / 2;

    // Draw top border
    gotoxy(start_x, start_y);
    for (int i = 0; i < border_width; i++) printf("*");
    
    // Draw side borders and empty space
    for (int i = 1; i < border_height - 1; i++) {
        gotoxy(start_x, start_y + i);
        printf("*");
        for (int j = 1; j < border_width - 1; j++) printf(" ");
        printf("*");
    }

    // Draw bottom border
    gotoxy(start_x, start_y + border_height - 1);
    for (int i = 0; i < border_width; i++) printf("*");

    // Print welcome message
    gotoxy(start_x + 2, start_y + 3);
    printf("Welcome to Pong Game!");

    // Print start instruction
    gotoxy(start_x + 2, start_y + 5);
    printf("Press space to start");

    // Wait for space bar press
    char key;
    do {
        key = _getch(); // Wait for a key press
    } while (key != ' '); // Continue looping until space bar is pressed

    clearScreen();
}

void drawBoard(GameState *game) {
    // Erase previous paddles
    for (int y = 1; y < BOARD_HEIGHT - 1; y++) {
        gotoxy(PADDLE_OFFSET, y);
        printf(" "); // Erase left paddle column
        gotoxy(BOARD_WIDTH - PADDLE_OFFSET - 1, y);
        printf(" "); // Erase right paddle column
    }

    // Draw left paddle in color
    setColor(FOREGROUND_BLUE | FOREGROUND_INTENSITY); // Blue color
    for (int i = 0; i < PADDLE_HEIGHT; i++) {
        gotoxy(PADDLE_OFFSET, game->paddle1Y + i);
        printf("||");
    }

    // Draw right paddle in color
    setColor(FOREGROUND_RED | FOREGROUND_INTENSITY); // Red color
    for (int i = 0; i < PADDLE_HEIGHT; i++) {
        gotoxy(BOARD_WIDTH - PADDLE_OFFSET - 1, game->paddle2Y + i);
        printf("||");
    }

    // Draw ball in color
    setColor(FOREGROUND_GREEN | FOREGROUND_INTENSITY); // Green color
    gotoxy(game->ballX, game->ballY);
    printf("O");

    // Reset color
    setColor(FOREGROUND_RED | FOREGROUND_GREEN | FOREGROUND_BLUE);
}

void drawScore(GameState *game) {
    // Draw the scores for each player
    gotoxy(BOARD_WIDTH / 2 - 15, BOARD_HEIGHT + 5);
    printf("Player 1: %d", game->score1);
    gotoxy(BOARD_WIDTH / 2 + 5, BOARD_HEIGHT + 5);
    printf("Player 2: %d", game->score2);
}

void processInput(char key, GameState *game) {
    // Paddle movement logic
    if (key == 'w') game->paddle1Y -= PADDLE_SPEED;
    if (key == 's') game->paddle1Y += PADDLE_SPEED;
    if (key == 'i') game->paddle2Y -= PADDLE_SPEED;
    if (key == 'k') game->paddle2Y += PADDLE_SPEED;
}

void updateGame(GameState *game) {
    // Erase the ball's previous position
    gotoxy(game->ballX, game->ballY);
    printf(" ");
    
    // Ball movement logic
    int nextBallX = game->ballX + game->ballVelX;
    int nextBallY = game->ballY + game->ballVelY;

    // Collision with top wall
    if (nextBallY <= 1) {
        nextBallY = 2; // Ensure the ball stays within the bounds
        game->ballVelY *= -1;
    }
    // Collision with bottom wall
    if (nextBallY >= BOARD_HEIGHT - 2) {
        nextBallY = BOARD_HEIGHT - 3; // Ensure the ball stays within the bounds
        game->ballVelY *= -1;
    }

    // Ball collision with paddles logic
    if ((nextBallX <= PADDLE_OFFSET + 1 && nextBallY >= game->paddle1Y && nextBallY <= game->paddle1Y + PADDLE_HEIGHT) ||
        (nextBallX >= BOARD_WIDTH - PADDLE_OFFSET - 2 && nextBallY >= game->paddle2Y && nextBallY <= game->paddle2Y + PADDLE_HEIGHT)) {
        nextBallX = (nextBallX <= PADDLE_OFFSET + 1) ? PADDLE_OFFSET + 2 : BOARD_WIDTH - PADDLE_OFFSET - 3; // Adjusted the values to keep the ball within bounds
        game->ballVelX *= -1;
    }

    // Update ball position after all checks
    game->ballX = nextBallX;
    game->ballY = nextBallY;

    // Ball out of bounds
    if (game->ballX <= 0 || game->ballX >= BOARD_WIDTH - 1) {
        int scoringPlayer = (game->ballX <= 0) ? 2 : 1;
        game->score2 += (scoringPlayer == 2) ? 1 : 0; // Increment score for player 2
        game->score1 += (scoringPlayer == 1) ? 1 : 0; // Increment score for player 1
        pauseAndDisplayScore(game, scoringPlayer); // Display scoring message and pause
        resetBall(game);
    }

    // Ball out of bounds
    if (game->ballX <= 0) {
        game->score2++; // Increment score for player 2
        pauseAndDisplayScore(game, 2); // Display scoring message for player 2 and pause
        resetBall(game);
    } else if (game->ballX >= BOARD_WIDTH - 1) {
        game->score1++; // Increment score for player 1
        pauseAndDisplayScore(game, 1); // Display scoring message for player 1 and pause
        resetBall(game);
    }

    // Erase paddles' previous positions
    for (int i = 0; i < BOARD_HEIGHT - 2; i++) {
        gotoxy(PADDLE_OFFSET, i + 1);
        printf("  ");
        gotoxy(BOARD_WIDTH - PADDLE_OFFSET - 1, i + 1);
        printf("  ");
    }

    // Paddle collision with top and bottom
    if (game->paddle1Y <= 1) game->paddle1Y = 1;
    if (game->paddle1Y >= BOARD_HEIGHT - PADDLE_HEIGHT - 1) game->paddle1Y = BOARD_HEIGHT - PADDLE_HEIGHT - 1;
    if (game->paddle2Y <= 1) game->paddle2Y = 1;
    if (game->paddle2Y >= BOARD_HEIGHT - PADDLE_HEIGHT - 1) game->paddle2Y = BOARD_HEIGHT - PADDLE_HEIGHT - 1;

    // Check for game end condition
    if (game->score1 >= WIN_SCORE || game->score2 >= WIN_SCORE) {
        // Display the winner
        int winner = (game->score1 >= WIN_SCORE) ? 1 : 2;
        gotoxy(BOARD_WIDTH / 2 - 10, BOARD_HEIGHT / 2);
        printf("Player %d wins the game!", winner);
        Sleep(5000); // Display the message for 5 seconds
        exit(0); // End the game
    }
}

void resetBall(GameState *game) {
    // Reset ball position
    game->ballX = BOARD_WIDTH / 2;
    game->ballY = BOARD_HEIGHT / 2;
    // Reset paddles
    game->paddle1Y = BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    game->paddle2Y = BOARD_HEIGHT / 2 - PADDLE_HEIGHT / 2;
    // Change ball direction
    game->ballVelX = -game->ballVelX;
    game->ballVelY = ((rand() % 2) * 2 - 1); // Randomize up or down
}

void pauseAndDisplayScore(GameState *game, int player) {
    // Calculate the position to start the message (center of the board)
    int messageX = BOARD_WIDTH / 2 - 10; // Adjust as needed for message length
    int messageY = BOARD_HEIGHT / 2;

    // Clear the previous message by overwriting with spaces
    gotoxy(messageX, messageY);
    printf("                     "); // Overwrite with enough spaces to cover the message

    // Display the new score message
    gotoxy(messageX, messageY);
    printf("Player %d scores!", player);

    // Pause the game for 3 seconds
    Sleep(2500);

    // Optionally, clear the message after the pause
    gotoxy(messageX, messageY);
    printf("                     "); // Overwrite the message with spaces again
}
