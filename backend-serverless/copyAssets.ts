import * as shell from "shelljs";

shell.cp('src/.env', 'dist/');
shell.mkdir('dist/logs');