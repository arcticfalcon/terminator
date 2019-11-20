import React, {Fragment} from 'react';
import Console from "../Console";
import Terminator from '../Terminator'
import defaultTheme, {coal} from 'theme'

export default {title: 'Terminator'};

const commands = [
    {
        "name": "ls",
        "description": "list folder",
        "handler": (params, terminator) => {
            setTimeout(() => {
                terminator.addResult("drwxr-xr-x 1 Juan 197121    0 Oct 26 17:35 ./\n" +
                    "drwxr-xr-x 1 Juan 197121    0 Oct 26 09:38 ../\n" +
                    "-rw-r--r-- 1 Juan 197121  297 Oct 26 17:39 .babelrc\n" +
                    "drwxr-xr-x 1 Juan 197121    0 Oct 26 10:17 .idea/\n" +
                    "drwxr-xr-x 1 Juan 197121    0 Oct 26 17:43 .storybook/\n" +
                    "drwxr-xr-x 1 Juan 197121    0 Oct 26 17:37 node_modules/\n" +
                    "-rw-r--r-- 1 Juan 197121 1.7K Oct 26 17:35 package.json\n" +
                    "-rw-r--r-- 1 Juan 197121  13K Oct 26 17:35 package-lock.json\n" +
                    "drwxr-xr-x 1 Juan 197121    0 Oct 26 15:14 src/\n" +
                    "-rw-r--r-- 1 Juan 197121 1.2K Oct 26 10:14 webpack.config.js\n" +
                    "-rw-r--r-- 1 Juan 197121 392K Oct 26 17:36 yarn.lock\n" +
                    "-rw-r--r-- 1 Juan 197121 2.8K Oct 26 09:43 yarn-error.log\n")
                terminator.done()
            }, 2000)
        }
    },
    {
        "name": "tail",
        "description": "tail description",
        "handler": (params, terminator, abortSignal) => {
            const p = setInterval(() => {
                terminator.addResult("tail result " + (new Date()).getTime() )
            }, 500)

            abortSignal.then(() => {
                clearInterval(p)
                terminator.done()
            })
        }
    },
    {
        "name": "top",
        "description": "top description",
        "handler": (params, terminator, abortSignal) => {
            setTimeout(() => {
                terminator.startFullScreenMode()
                let to1, to2
                const out1 = () => {
                    terminator.setFullScreenContent("top - 21:53:05 up 58 min,  1 user,  load average: 0.00, 0.00, 0.00\n" +
                        "Tasks:  95 total,   1 running,  94 sleeping,   0 stopped,   0 zombie\n" +
                        "%Cpu(s):  0.0 us,  0.0 sy,  0.0 ni, 96.2 id,  0.0 wa,  0.0 hi,  0.0 si,  3.8 st\n" +
                        "KiB Mem :  1542020 total,  1162496 free,    86484 used,   293040 buff/cache\n" +
                        "KiB Swap:  4117500 total,  4117500 free,        0 used.  1305428 avail Mem\n" +
                        "\n" +
                        "  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND\n" +
                        "    1 root      20   0   37724   5664   3912 S   0.0  0.4   0:02.77 systemd\n" +
                        "    2 root      20   0       0      0      0 S   0.0  0.0   0:00.00 kthreadd\n" +
                        "    3 root      20   0       0      0      0 S   0.0  0.0   0:00.02 ksoftirqd/0\n" +
                        "    5 root       0 -20       0      0      0 S   0.0  0.0   0:00.00 kworker/0:0H\n" +
                        "    7 root      20   0       0      0      0 S   0.0  0.0   0:00.08 rcu_sched\n" +
                        "    8 root      20   0       0      0      0 S   0.0  0.0   0:00.00 rcu_bh\n" +
                        "    9 root      rt   0       0      0      0 S   0.0  0.0   0:00.00 migration/0\n" +
                        "   10 root      rt   0       0      0      0 S   0.0  0.0   0:00.01 watchdog/0\n" +
                        "   11 root      rt   0       0      0      0 S   0.0  0.0   0:00.01 watchdog/1")

                    to1 = setTimeout(out2, 1500)
                }
                const out2 = () => {
                    terminator.setFullScreenContent("top - 21:53:06 up 58 min,  1 user,  load average: 0.00, 0.00, 0.00\n" +
                        "Tasks:  95 total,   1 running,  94 sleeping,   0 stopped,   0 zombie\n" +
                        "%Cpu(s):  0.0 us,  0.0 sy,  0.0 ni, 99.5 id,  0.5 wa,  0.0 hi,  0.0 si,  0.0 st\n" +
                        "KiB Mem :  1542020 total,  1163904 free,    85108 used,   293008 buff/cache\n" +
                        "KiB Swap:  4117500 total,  4117500 free,        0 used.  1306844 avail Mem\n" +
                        "\n" +
                        "  PID USER      PR  NI    VIRT    RES    SHR S  %CPU %MEM     TIME+ COMMAND\n" +
                        "    1 root      20   0   37704   5708   3980 S   0.0  0.4   0:02.46 systemd\n" +
                        "    2 root      20   0       0      0      0 S   0.0  0.0   0:00.00 kthreadd\n" +
                        "    3 root      20   0       0      0      0 S   0.0  0.0   0:00.02 ksoftirqd/0\n" +
                        "    5 root       0 -20       0      0      0 S   0.0  0.0   0:00.00 kworker/0:0H\n" +
                        "    7 root      20   0       0      0      0 S   0.0  0.0   0:00.14 rcu_sched\n" +
                        "    8 root      20   0       0      0      0 S   0.0  0.0   0:00.00 rcu_bh\n" +
                        "    9 root      rt   0       0      0      0 S   0.0  0.0   0:00.00 migration/0\n" +
                        "   10 root      rt   0       0      0      0 S   0.0  0.0   0:00.01 watchdog/0\n" +
                        "   11 root      rt   0       0      0      0 S   0.0  0.0   0:00.01 watchdog/1")
                    to2 = setTimeout(out1, 1500)
                }

                out1()
                abortSignal.then(() => {
                    clearTimeout(to1)
                    clearTimeout(to2)
                })
            }, 2000)
        }
    }
]

const ssh = <Fragment><span style={{color: "#00FF00"}}>root@13.31.123.144</span> $</Fragment>

defaultTheme.promptSymbol = ssh

export const defaultConfig = () => <Console terminator={new Terminator(commands)} theme={coal}/>;
export const multiple = () => <div>
    <Console terminator={new Terminator(commands)} theme={coal}/>
    <Console terminator={new Terminator(commands)}/>
</div>;

